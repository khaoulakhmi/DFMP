import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../modules/auth/auth.utils'
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError'
// extend express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user: { id: string; role: string }
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken
        if (typeof token !== 'string' || !token) {
            return next(new AppError({
                statusCode: 401,
                code: 'INVALID_TOKEN',
                message: 'No token provided',
            }))
        }

        let userId: string
         try {
        const payload = verifyAccessToken(token)

        if (typeof payload?.userId !== 'string' || !payload.userId) {
            return next(new AppError({
                statusCode: 401,
                code: 'INVALID_TOKEN',
                message: 'Invalid token payload',
            }))
        }

        userId = payload.userId
    } catch {
        return next(new AppError({
            statusCode: 401,
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token',
        }))
    }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    role: true,
                    status: true,
                },
            })

            if (!user || !user.status) {
                return next(new AppError({
                    statusCode: 401,
                    code: 'INVALID_SESSION',
                    message: 'Invalid session',
                }))
            }

            // Use the current database role for authorization.
            req.user = {
                id: user.id,
                role: user.role,
            }
        } catch (error: unknown) {

            return next(error)
        }
        next()
    } catch (error: unknown) {
        return next(error)
    }
}