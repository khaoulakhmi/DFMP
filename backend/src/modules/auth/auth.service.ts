import prisma from '../../config/prisma'
import { comparePassword, hashPassword } from '../../utils/hash'
import { generateTokens, verifyRefreshToken, getRefreshTokenExpiry } from './auth.utils'
import { LoginDTO, ResetPasswordDTO, AuthTokens } from './auth.types'

export const AuthService = {

    async login(data: LoginDTO): Promise<AuthTokens> {
        // 1. find user
        const user = await prisma.user.findUnique({
            where: { username: data.username }
        })
        if (!user) throw new Error('Invalid credentials')

        // 2. check status
        if (!user.status) throw new Error('Account is disabled')

        // 3. verify password
        const isValid = await comparePassword(data.password, user.password)
        if (!isValid) throw new Error('Invalid password')

        // 4. generate tokens
        const tokens = generateTokens({ userId: user.id, role: user.role })

        // 5. save refresh token in DB
        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiry()
            }
        })

        return tokens
    },

    async logout(refreshToken: string): Promise<void> {
        // delete refresh token from DB
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        })
    },

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        // 1. check token exists in DB
        const stored = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        })
        if (!stored) throw new Error('Invalid refresh token')

        // 2. check expiry
        if (stored.expiresAt < new Date()) {
            await prisma.refreshToken.delete({ where: { token: refreshToken } })
            throw new Error('Refresh token expired')
        }

        // 3. verify signature
        const payload = verifyRefreshToken(refreshToken)

        // 4. generate new access token
        const jwt = require('jsonwebtoken')
        const accessToken = jwt.sign(
            { userId: payload.userId, role: payload.role },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        )

        return { accessToken }
    },

    async resetPassword(userId: string, data: ResetPasswordDTO): Promise<void> {
        // 1. find user
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw new Error('User not found')

        // 2. verify old password
        const isValid = await comparePassword(data.oldPassword, user.password)
        if (!isValid) throw new Error('Old password is incorrect')

        // 3. hash and save new password
        const hashed = await hashPassword(data.newPassword)
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashed }
        })

        // 4. revoke all refresh tokens (force re-login)
        await prisma.refreshToken.deleteMany({ where: { userId } })
    }
}