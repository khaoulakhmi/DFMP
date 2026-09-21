import { CookieOptions, Request, Response } from 'express'
import { AuthService } from './auth.service'
import { hasErrorMessage } from '../../utils/error'
import { env } from '../../config/env'
import { REFRESH_TOKEN_MAX_AGE_MS } from './auth.utils'
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
            const { user, tokens } = await AuthService.login(req.body)
            setAccessTokenCookie(res, tokens.accessToken)
            res.cookie('refreshToken', tokens.refreshToken, {
                ...refreshTokenCookieOptions,
                maxAge: REFRESH_TOKEN_MAX_AGE_MS,
            })
            res.json({ user })
        } catch (error: unknown) {
            const isAuthenticationFailure = [
                'Invalid credentials',
                'Invalid password',
                'Account is disabled',
            ].some(message => hasErrorMessage(error, message))

            if (isAuthenticationFailure) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            console.error('Unexpected error during login.', error)
            res.status(500).json({ error: 'Failed to login' })
        }
    },

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

    async refresh(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken as string | undefined
            if (!refreshToken) {
                return res.status(401).json({ error: 'Refresh token is required' })
            }
            const tokens = await AuthService.refresh(refreshToken)
            setAccessTokenCookie(res, tokens.accessToken)
            res.status(204).send()
        } catch {
            res.status(401).json({ error: 'Invalid or expired refresh token' })
        }
    },

    async resetPassword(req: Request, res: Response) {
        try {
            await AuthService.resetPassword(req.user.id, req.body)
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
