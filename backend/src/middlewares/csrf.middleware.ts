import type { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

const trustedOrigin = new URL(env.frontendUrl).origin
const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS'])

const getSourceOrigin = (req: Request): string | null => {
    const origin = req.get('Origin')

    // If supplied, validate it directly—even when its value is "null".
    if (origin !== undefined) {
        return origin
    }

    // Some requests omit Origin; use Referer as a fallback.
    const referer = req.get('Referer')

    if (!referer) return null

    try {
        return new URL(referer).origin
    } catch {
        return null
    }
}

export const csrfProtection = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (safeMethods.has(req.method)) {
        return next()
    }

    const sourceOrigin = getSourceOrigin(req)

    if (sourceOrigin !== trustedOrigin) {
        return res.status(403).json({
            code: 'CSRF_REJECTED',
            error: 'Missing or untrusted request origin',
        })
    }

    if (req.get('X-CSRF-Protection') !== '1') {
        return res.status(403).json({
            code: 'CSRF_REJECTED',
            error: 'Missing or invalid CSRF protection header',
        })
    }

    next()
}