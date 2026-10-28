import { Prisma } from '../generated/prisma/client'
import {
    alreadyExistsError,
    conflictError,
    invalidReferenceError,
    notFoundError,
    resourceInUseError,
} from './AppError'

type Operation = 'create' | 'update' | 'delete'

type Options = {
    // Overrides the default `<RESOURCE>_ALREADY_EXISTS` for unique violations.
    duplicate?: { code: string, message: string }
}

/**
 * Builds a function that turns Prisma errors for one resource into AppErrors:
 * - P2025 (record missing): 404 `<RESOURCE>_NOT_FOUND` on update/delete,
 *   400 INVALID_REFERENCE on create (a connected record was missing).
 * - P2003 (foreign key): 400 INVALID_REFERENCE on create/update,
 *   409 `<RESOURCE>_IN_USE` on delete.
 * - P2002 (unique): 409 `<RESOURCE>_ALREADY_EXISTS`, or `options.duplicate`.
 * Anything else is returned unchanged for the global error handler.
 */
export const createPrismaErrorMapper = (resource: string, options: Options = {}) => {
    return (error: unknown, operation: Operation): unknown => {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
            return error
        }

        switch (error.code) {
            case 'P2025':
                return operation === 'create'
                    ? invalidReferenceError()
                    : notFoundError(resource)
            case 'P2003':
                return operation === 'delete'
                    ? resourceInUseError(resource)
                    : invalidReferenceError()
            case 'P2002':
                return options.duplicate
                    ? conflictError(options.duplicate.code, options.duplicate.message)
                    : alreadyExistsError(resource)
            default:
                return error
        }
    }
}
