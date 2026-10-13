import { Request, Response, NextFunction } from 'express'
import { Role } from '../generated/prisma/enums'
import { AppError } from '../utils/AppError'
export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        // 1. make sure user is authenticated first
        if (!req.user) {
            return next(new AppError({
                statusCode: 401,
                code: 'UNAUTHORIZED',
                message: 'You must be logged in to access this resource',
            }))
        }

        // 2. check if user role is allowed
        const hasRole = allowedRoles.includes(req.user.role as Role)
        
        if (!hasRole) {
            return next(new AppError({
                statusCode: 403,
                code: 'FORBIDDEN',
                message: `Only ${allowedRoles.join(', ')} can access this resource`
            })) 
        }

        next() // ✅ role is allowed → continue
    }
}

export const authorizeSelfOrAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new AppError({
            statusCode: 401,
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        }))
    }

    const isAdmin = req.user.role === 'ADMIN'
    const isSelf = req.user.id === req.params.id

    if (!isAdmin && !isSelf) {
        return next(new AppError({
            statusCode: 403,
            code: 'FORBIDDEN',
            message: 'You can only access your own account',
        }))
    }

    next()
}