import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authenticate } from '../../middlewares/auth.middleware'
import { loginSchema, resetPasswordSchema } from './auth.validation'

const authRouter = Router()

authRouter.post('/login',          validate(loginSchema),        AuthController.login)
authRouter.post('/logout',                                      AuthController.logout)
authRouter.post('/refresh',                                     AuthController.refresh)
authRouter.post('/reset-password', authenticate, validate(resetPasswordSchema), AuthController.resetPassword)

export default authRouter
