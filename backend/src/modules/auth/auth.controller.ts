import { CookieOptions, NextFunction, Request, Response } from 'express'
import { AuthService } from './auth.service'
import { hasErrorMessage } from '../../utils/error'
import { env } from '../../config/env'
import { REFRESH_TOKEN_MAX_AGE_MS } from './auth.utils'
import {
    AuthenticationError,
    type RotationRefreshResult,
} from './auth.types'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma'
import { userSelect } from '../user/user.select'
import { AppError } from '../../utils/AppError'

const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/api/auth',
}

const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/api',
}

const setAccessTokenCookie = (res: Response, token: string) => {
    const payload = jwt.decode(token) as jwt.JwtPayload
    res.cookie('accessToken', token, {
        ...accessTokenCookieOptions,
        expires: new Date(payload.exp! * 1000),
    })
}

const clearAuthCookies = (res: Response) => {
    res.clearCookie('accessToken', accessTokenCookieOptions)
    res.clearCookie('refreshToken', refreshTokenCookieOptions)
}

const setAuthCookies = (
    res: Response,
    result: RotationRefreshResult,
) => {
    setAccessTokenCookie(res, result.tokens.accessToken)

    res.cookie('refreshToken', result.tokens.refreshToken, {
        ...refreshTokenCookieOptions,
        expires: result.refreshExpiresAt,
    })
}

export const AuthController = {

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: userSelect,
            })
            if (!user || !user.status) {
                return next(new AppError({
                    statusCode: 401,
                    code: 'INVALID_SESSION',
                    message: 'Invalid session',
                }))
            }
            res.json({ user })
        } catch (error: unknown) {
            next(error)
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await AuthService.loginWithRotation(req.body)

        setAuthCookies(res, result)

        res.json({ user: result.user })
    } 
    catch (error: unknown) {
        if (error instanceof AuthenticationError) {
            return next(new AppError({
                statusCode: 401,
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid credentials',
            }))
        }

        next(error)
    }
},

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken as string | undefined
            if (refreshToken) {
                await AuthService.logout(refreshToken)
            }
            res.clearCookie('refreshToken', refreshTokenCookieOptions)
            res.clearCookie('accessToken', accessTokenCookieOptions)
            res.status(204).send()
        } 
        catch(error: unknown) {
            next(error)
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies?.refreshToken

        if (
            typeof refreshToken !== 'string' ||
            refreshToken.length === 0
        ) {
            throw new AuthenticationError('Refresh token required')
        }

        const result = await AuthService.refreshWithRotation(
            refreshToken,
        )

        setAuthCookies(res, result)

        return res.status(204).send()
    } 
    catch (error: unknown) {
        if (error instanceof AuthenticationError) {
            // Preserve the existing cookie cleanup.
            clearAuthCookies(res)

            return next(new AppError({
                statusCode: 401,
                code: 'INVALID_SESSION',
                message: 'Invalid or expired session',
            }))
        }

        next(error)
    }
},

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthService.resetPassword(req.user.id, req.body)
            clearAuthCookies(res)
            res.json({ message: 'Password reset successfully' })
        } 
        catch (error: unknown) {
            if (hasErrorMessage(error, 'Old password is incorrect')) {
                return next(new AppError({
                    statusCode: 400,
                    code: 'INCORRECT_PASSWORD',
                    message: 'Old password is incorrect',
                }))
            }

            if (hasErrorMessage(error, 'User not found')) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'USER_NOT_FOUND',
                    message: 'User not found',
                }))
            }

            next(error)
        }
    }
}
