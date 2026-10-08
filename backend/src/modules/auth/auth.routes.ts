import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authenticate } from '../../middlewares/auth.middleware'
import { loginSchema, resetPasswordSchema } from './auth.validation'
import {
    loginLimiter,
    refreshLimiter,
} from '../../middlewares/rateLimit.middleware'


const authRouter = Router()

authRouter.get('/me', authenticate, AuthController.me)

authRouter.post('/login', loginLimiter, validate(loginSchema), AuthController.login)
authRouter.post('/logout', authenticate, AuthController.logout)
authRouter.post('/refresh', refreshLimiter, AuthController.refresh)
authRouter.post('/reset-password', authenticate, validate(resetPasswordSchema), AuthController.resetPassword)

export default authRouter
