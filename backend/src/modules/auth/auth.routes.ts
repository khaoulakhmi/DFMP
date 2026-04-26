import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authenticate } from '../../middlewares/auth.middleware'
import { loginSchema, refreshTokenSchema, resetPasswordSchema } from './auth.validation'

const authRouter = Router()

authRouter.post('/login',          validate(loginSchema),        AuthController.login)
authRouter.post('/logout',         validate(refreshTokenSchema), AuthController.logout)
authRouter.post('/refresh',        validate(refreshTokenSchema), AuthController.refresh)
authRouter.post('/reset-password', authenticate, validate(resetPasswordSchema), AuthController.resetPassword)

export default authRouter