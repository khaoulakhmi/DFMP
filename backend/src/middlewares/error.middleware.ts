import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '../generated/prisma/client'
import { AppError } from '../utils/AppError'

type ValidationIssue = {
    field: string
    message: string
}

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    req,
    res,
    next,
) => {
    if (res.headersSent) {
        next(error)
        return
    }

    let statusCode = 500
    let code = 'INTERNAL_ERROR'
    let message = 'Internal server error'
    let errors: ValidationIssue[] | undefined

    if (error instanceof AppError) {
        statusCode = error.statusCode
        code = error.code

        // Only expected client errors expose their supplied message.
        if (statusCode >= 400 && statusCode < 500) {
            message = error.message
        }
    } else if (error instanceof ZodError) {
        statusCode = 400
        code = 'VALIDATION_FAILED'
        message = 'Validation failed'
        errors = error.issues.map(issue => ({
            field: issue.path.map(String).join('.'),
            message: 'Invalid value',
        }))
    } else if (
        error instanceof Prisma.PrismaClientKnownRequestError
    ) {
        switch (error.code) {
            case 'P2002':
                statusCode = 409
                code = 'DUPLICATE_VALUE'
                message = 'A record with this value already exists'
                break
            case 'P2025':
                statusCode = 404
                code = 'RECORD_NOT_FOUND'
                message = 'Record not found'
                break
            case 'P2003':
                statusCode = 409
                code = 'RELATED_RECORD_CONFLICT'
                message = 'This operation conflicts with related records'
                break
        }
    } else {
        // Errors produced by Express body parsers.
        const type =
            typeof error === 'object' && error !== null
                ? (error as { type?: unknown }).type
                : undefined

        if (
            type === 'entity.parse.failed' ||
            type === 'querystring.parse.rangeError'
        ) {
            statusCode = 400
            code = 'INVALID_BODY'
            message = 'Malformed request body'
        } else if (
            type === 'entity.too.large' ||
            type === 'parameters.too.many'
        ) {
            statusCode = 413
            code = 'PAYLOAD_TOO_LARGE'
            message = 'Request body is too large'
        } else if (
            type === 'encoding.unsupported' ||
            type === 'charset.unsupported'
        ) {
            statusCode = 415
            code = 'UNSUPPORTED_ENCODING'
            message = 'Unsupported request body encoding'
        }
    }

    // Protect against accidentally constructing an invalid AppError.
    if (
        !Number.isInteger(statusCode) ||
        statusCode < 400 ||
        statusCode > 599
    ) {
        statusCode = 500
        code = 'INTERNAL_ERROR'
        message = 'Internal server error'
    }

    // The request logger records this once when the response completes.
    res.locals.errorCode = code

    res.status(statusCode).json({
        error: message,
        message,
        code,
        requestId: req.requestId,
        ...(errors ? { errors } : {}),
    })
}