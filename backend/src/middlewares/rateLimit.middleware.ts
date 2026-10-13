import { rateLimit } from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
   handler: (_req, _res, next) => {
    next(new AppError({
        statusCode: 429,
        code: 'LOGIN_RATE_LIMITED',
        message: 'Too many login attempts. Please try again later.',
    }))
},
})

export const refreshLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
   handler: (_req, _res, next) => {
    next(new AppError({
        statusCode: 429,
        code: 'REFRESH_RATE_LIMITED',
        message: 'Too many refresh requests. Please try again later.',
    }))
},
})