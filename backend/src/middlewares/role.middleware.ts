import { Request, Response, NextFunction } from 'express'
import { Role } from '../generated/prisma/enums'

export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        // 1. make sure user is authenticated first
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        // 2. check if user role is allowed
        const hasRole = allowedRoles.includes(req.user.role as Role)
        
        if (!hasRole) {
            return res.status(403).json({ 
                error: 'Forbidden',
                message: `Only ${allowedRoles.join(', ')} can access this resource`
            })
        }

        next() // ✅ role is allowed → continue
    }
}