import { CookieOptions, Request, Response } from 'express'
import { AuthService } from './auth.service'
import { hasErrorMessage } from '../../utils/error'
import { env } from '../../config/env'
import { REFRESH_TOKEN_MAX_AGE_MS } from './auth.utils'

const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/api/auth',
}

export const AuthController = {

    async login(req: Request, res: Response) {
        try {
            const { user, tokens } = await AuthService.login(req.body)
            console.log('Login successful for user:', user, tokens)
            res.cookie('refreshToken', tokens.refreshToken, {
                ...refreshTokenCookieOptions,
                maxAge: REFRESH_TOKEN_MAX_AGE_MS,
            })
            res.json({ user, tokens: { accessToken: tokens.accessToken } })
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
            res.json(tokens)
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
