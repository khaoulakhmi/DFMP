import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { hasErrorMessage } from '../../utils/error'

export const AuthController = {

    async login(req: Request, res: Response) {
        try {
            const tokens = await AuthService.login(req.body)
            res.json(tokens)
        } catch (error: unknown) {
            const isAuthenticationFailure = [
                'Invalid credentials',
                'Invalid password',
                'Account is disabled',
            ].some(message => hasErrorMessage(error, message))

            if (isAuthenticationFailure) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            console.error('Unexpected error during login.')
            res.status(500).json({ error: 'Failed to login' })
        }
    },

    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body
            await AuthService.logout(refreshToken)
            res.status(204).send()
        } catch {
            console.error('Unexpected error during logout.')
            res.status(500).json({ error: 'Failed to logout' })
        }
    },

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body
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
