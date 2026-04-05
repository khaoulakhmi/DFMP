import { Request, Response } from 'express'
import { AuthService } from './auth.service'

export const AuthController = {

    async login(req: Request, res: Response) {
        try {
            const tokens = await AuthService.login(req.body)
            res.json(tokens)
        } catch (error: any) {
            console.error('Login error:', error)
            const isClientError = ['Invalid credentials', 'Account is disabled'].includes(error.message)
            res.status(isClientError ? 401 : 500).json({ error: error.message })
        }
    },

    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body
            await AuthService.logout(refreshToken)
            res.status(204).send()
        } catch (error: any) {
            console.error('Logout error:', error)
            res.status(500).json({ error: 'Failed to logout' })
        }
    },

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body
            const tokens = await AuthService.refresh(refreshToken)
            res.json(tokens)
        } catch (error: any) {
            console.error('Refresh error:', error)
            res.status(401).json({ error: error.message })
        }
    },

    async resetPassword(req: Request, res: Response) {
        try {
            await AuthService.resetPassword(req.user.id, req.body)
            res.json({ message: 'Password reset successfully' })
        } catch (error: any) {
            console.error('Reset password error:', error)
            const isClientError = error.message === 'Old password is incorrect'
            res.status(isClientError ? 400 : 500).json({ error: error.message })
        }
    }
}