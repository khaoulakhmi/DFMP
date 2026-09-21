import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../modules/auth/auth.utils'

// extend express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user: { id: string; role: string }
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken
        if (typeof token !== 'string' || !token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const payload = verifyAccessToken(token)

        req.user = { id: payload.userId, role: payload.role }
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}