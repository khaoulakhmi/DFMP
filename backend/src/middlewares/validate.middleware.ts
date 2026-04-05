// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const validate = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body:   req.body,
                params: req.params,
                query:  req.query
            })
            next() // ✅ passes validation → go to controller
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.errors.map((e: any) => ({
                        field:   e.path.join('.'), // e.g "body.password"
                        message: e.message         // e.g "Password must be at least 6 characters"
                    }))
                })
            }
            next(error) // unexpected error → pass to error handler
        }
    }
}