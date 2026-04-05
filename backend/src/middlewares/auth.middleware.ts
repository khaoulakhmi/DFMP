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
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const token = authHeader.split(' ')[1]
        const payload = verifyAccessToken(token)

        req.user = { id: payload.userId, role: payload.role }
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}