import { randomUUID } from 'node:crypto'
import type { RequestHandler } from 'express'
import { logger } from '../config/logger'

declare global {
    namespace Express {
        interface Request {
            requestId?: string
        }
    }
}

export const requestLogging: RequestHandler = (req, res, next) => {
    const requestId = randomUUID()
    const startedAt = performance.now()

    req.requestId = requestId
    res.setHeader('X-Request-ID', requestId)

    let logged = false

    const writeLog = (aborted: boolean) => {
        if (logged) return
        logged = true

        const entry = {
            event: aborted ? 'request_aborted' : 'request_completed',
            requestId,
            method: req.method,
            // Route template, such as "/:id", rather than user input.
            route: typeof req.route?.path === 'string'
                ? req.route.path
                : 'unmatched',
            status: aborted ? null : res.statusCode,
            durationMs: Math.round(performance.now() - startedAt),
            errorCode: res.locals.errorCode,
        }

        if (aborted || res.statusCode >= 500) {
            logger.error(entry)
        } else if (res.statusCode >= 400) {
            logger.warn(entry)
        } else {
            logger.info(entry)
        }
    }

    res.once('finish', () => writeLog(false))
    res.once('close', () => {
        if (!res.writableFinished) writeLog(true)
    })

    next()
}