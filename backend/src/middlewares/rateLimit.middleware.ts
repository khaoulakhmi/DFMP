import { rateLimit } from 'express-rate-limit'

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        code: 'LOGIN_RATE_LIMITED',
        error: 'Too many login attempts. Please try again later.',
    },
})

export const refreshLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        code: 'REFRESH_RATE_LIMITED',
        error: 'Too many refresh requests. Please try again later.',
    },
})