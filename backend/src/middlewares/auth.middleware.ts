import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../modules/auth/auth.utils'
import prisma from '../config/prisma';

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
            return res.status(401).json({ error: 'No token provided' })
        }

        let userId: string
         try {
        const payload = verifyAccessToken(token)

        if (typeof payload?.userId !== 'string' || !payload.userId) {
            return res.status(401).json({
                error: 'Invalid token payload',
            })
        }

        userId = payload.userId
    } catch {
        return res.status(401).json({
            error: 'Invalid or expired token',
        })
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
                return res.status(401).json({
                    code: 'ACCOUNT_UNAVAILABLE',
                    error: 'Account is unavailable',
                })
            }

            // Use the current database role for authorization.
            req.user = {
                id: user.id,
                role: user.role,
            }
        } catch {
            console.error('Database lookup failed during authentication.')

            return res.status(500).json({
                error: 'Unable to verify account',
            })
        }
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}