import { CookieOptions, Request, Response } from 'express'
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

    async me(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: userSelect,
            })
            if (!user || !user.status) {
                return res.status(401).json({ error: 'Invalid session' })
            }
            res.json({ user })
        } catch {
            res.status(500).json({ error: 'Failed to load session' })
        }
    },

    async login(req: Request, res: Response) {
    try {
        const result = await AuthService.loginWithRotation(req.body)

        setAuthCookies(res, result)

        res.json({ user: result.user })
    } catch (error: unknown) {
        if (error instanceof AuthenticationError) {
            return res.status(401).json({
                error: 'Invalid credentials',
            })
        }

        // Avoid logging request bodies or tokens.
        console.error('Unexpected login failure')

        return res.status(500).json({
            error: 'Failed to login',
        })
    }
},

    // async login(req: Request, res: Response) {
    //     try {
    //         const { user, tokens } = await AuthService.login(req.body)
    //         setAccessTokenCookie(res, tokens.accessToken)
    //         res.cookie('refreshToken', tokens.refreshToken, {
    //             ...refreshTokenCookieOptions,
    //             maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    //         })
    //         res.json({ user })
    //     } catch (error: unknown) {
    //         const isAuthenticationFailure = [
    //             'Invalid credentials',
    //             'Invalid password',
    //             'Account is disabled',
    //         ].some(message => hasErrorMessage(error, message))

    //         if (isAuthenticationFailure) {
    //             return res.status(401).json({ error: 'Invalid credentials' })
    //         }

    //         console.error('Unexpected error during login.', error)
    //         res.status(500).json({ error: 'Failed to login' })
    //     }
    // },

    async logout(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken as string | undefined
            if (refreshToken) {
                await AuthService.logout(refreshToken)
            }
            res.clearCookie('refreshToken', refreshTokenCookieOptions)
            res.clearCookie('accessToken', accessTokenCookieOptions)
            res.status(204).send()
        } catch {
            console.error('Unexpected error during logout.')
            res.status(500).json({ error: 'Failed to logout' })
        }
    },

    // async refresh(req: Request, res: Response) {
    //     try {
    //         const refreshToken = req.cookies.refreshToken as string | undefined
    //         if (!refreshToken) {
    //             return res.status(401).json({ error: 'Refresh token is required' })
    //         }
    //         const tokens = await AuthService.refresh(refreshToken)
    //         setAccessTokenCookie(res, tokens.accessToken)
    //         res.status(204).send()
    //     } catch {
    //         res.status(401).json({ error: 'Invalid or expired refresh token' })
    //     }
    // },
    async refresh(req: Request, res: Response) {
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
    } catch (error: unknown) {
        if (error instanceof AuthenticationError) {
            clearAuthCookies(res)

            return res.status(401).json({
                error: 'Invalid or expired session',
            })
        }

        console.error('Unexpected refresh failure')

        return res.status(500).json({
            error: 'Failed to refresh session',
        })
    }
},

    async resetPassword(req: Request, res: Response) {
        try {
            await AuthService.resetPassword(req.user.id, req.body)
            clearAuthCookies(res)
            res.json({ message: 'Password reset successfully' })
        } catch (error: unknown) {
            if (hasErrorMessage(error, 'Old password is incorrect')) {
                return res.status(400).json({ error: 'Old password is incorrect' })
            }
            if (hasErrorMessage(error, 'User not found')) {
                return res.status(404).json({ error: 'User not found' })
            }

            console.error('Unexpected error while resetting a password.')
            res.status(500).json({ error: 'Failed to reset password' })
        }
    }
}
