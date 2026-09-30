import prisma from '../../config/prisma'
import { comparePassword, hashPassword } from '../../utils/hash'
import { 
    generateTokens, 
    verifyRefreshToken, 
    getRefreshTokenExpiry, 
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    verifyRotationRefreshToken,
    REFRESH_TOKEN_MAX_AGE_MS, } from './auth.utils'
import { 
    LoginDTO, 
    ResetPasswordDTO, 
    LoginServiceResult,
    AuthenticationError,
    type RotationLoginResult,
    type RotationRefreshResult
 } from './auth.types'
import { userSelect } from '../user/user.select'

export const AuthService = {

    async loginWithRotation( data: LoginDTO ): Promise<RotationLoginResult> {
        
    const candidate = await prisma.user.findUnique({
        where: { username: data.username },
        select: { id: true },
    })

    if (!candidate) {
        throw new AuthenticationError('Invalid credentials')
    }

    return prisma.$transaction(async (tx) => {
        // Your database uses the public schema.
        await tx.$queryRaw`
            SELECT "id"
            FROM public."User"
            WHERE "id" = ${candidate.id}
            FOR UPDATE
        `

        const user = await tx.user.findUnique({
            where: { id: candidate.id },
            select: { ...userSelect, password: true },
        })

        if (
            !user ||
            !user.status ||
            !(await comparePassword(data.password, user.password))
        ) {
            throw new AuthenticationError('Invalid credentials')
        }

        // Round to seconds to match the JWT exp value.
        const expiresAt = new Date(
            Math.floor(
                (Date.now() + REFRESH_TOKEN_MAX_AGE_MS) / 1000,
            ) * 1000,
        )

        const session = await tx.authSession.create({
            data: {
                userId: user.id,
                expiresAt,
            },
        })

        const accessToken = generateAccessToken({
            userId: user.id,
            role: user.role,
        })

        const refreshToken = generateRefreshToken(user.id, session)

        await tx.refreshToken.create({
            data: {
                tokenHash: hashRefreshToken(refreshToken),
                userId: user.id,
                sessionId: session.id,
                expiresAt: session.expiresAt,
            },
        })

        const { password: _password, ...safeUser } = user

        return {
            user: safeUser,
            tokens: { accessToken, refreshToken },
            refreshExpiresAt: session.expiresAt,
        }
    }, {
        isolationLevel: 'ReadCommitted',
    })
},

async refreshWithRotation(
    refreshToken: string,
): Promise<RotationRefreshResult> {
    // Verify signature, expiration, and required payload fields.
    const payload = verifyRotationRefreshToken(refreshToken)
    const tokenHash = hashRefreshToken(refreshToken)

    const result = await prisma.$transaction(async (tx) => {
        // Same locking order as loginWithRotation().
        await tx.$queryRaw`
            SELECT "id"
            FROM public."User"
            WHERE "id" = ${payload.userId}
            FOR UPDATE
        `

        const stored = await tx.refreshToken.findUnique({
            where: { tokenHash },
            include: {
                session: true,
                user: { select: userSelect },
            },
        })

        // Confirm that the token and database records agree.
        if (
            !stored ||
            !stored.session ||
            stored.userId !== payload.userId ||
            stored.sessionId !== payload.sessionId ||
            stored.session.userId !== payload.userId ||
            stored.expiresAt.getTime() !== payload.exp * 1000 ||
            stored.session.expiresAt.getTime() !==
                stored.expiresAt.getTime()
        ) {
            return null
        }

        const session = stored.session
        const now = new Date()

        if (
            session.revokedAt ||
            session.expiresAt <= now ||
            stored.expiresAt <= now ||
            !stored.user.status
        ) {
            return null
        }

        // Reusing a consumed token revokes this login session.
        if (stored.usedAt) {
            await tx.authSession.update({
                where: { id: session.id },
                data: { revokedAt: now },
            })

            // Commit the revocation before reporting failure.
            return null
        }

        // Consume the current token.
        const consumed = await tx.refreshToken.updateMany({
            where: {
                id: stored.id,
                usedAt: null,
            },
            data: { usedAt: now },
        })

        if (consumed.count !== 1) {
            await tx.authSession.update({
                where: { id: session.id },
                data: { revokedAt: now },
            })

            return null
        }

        // Use the user's current role from the database.
        const accessToken = generateAccessToken({
            userId: stored.userId,
            role: stored.user.role,
        })

        const nextRefreshToken = generateRefreshToken(
            stored.userId,
            session,
        )

        await tx.refreshToken.create({
            data: {
                tokenHash: hashRefreshToken(nextRefreshToken),
                userId: stored.userId,
                sessionId: session.id,
                expiresAt: session.expiresAt,
            },
        })

        return {
            tokens: {
                accessToken,
                refreshToken: nextRefreshToken,
            },
            refreshExpiresAt: session.expiresAt,
        }
    }, {
        isolationLevel: 'ReadCommitted',
    })

    if (!result) {
        throw new AuthenticationError(
            'Invalid or expired refresh token',
        )
    }

    return result
},

    async login(data: LoginDTO): Promise<LoginServiceResult> {
        // 1. find user (only select password + public fields)
        const user = await prisma.user.findUnique({
            where: { username: data.username },
            select: { ...userSelect, password: true }
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

        const { password: _password, ...safeUser } = user

        return {
            user: safeUser,
            tokens,
        }


    },

    // async logout(refreshToken: string): Promise<void> {
    //     // delete refresh token from DB
    //     await prisma.refreshToken.deleteMany({
    //         where: { token: refreshToken }
    //     })
    // },

    async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken)

    // Support both new hashed tokens and temporary legacy tokens.
    const candidate = await prisma.refreshToken.findFirst({
        where: {
            OR: [
                { tokenHash },
                { token: refreshToken },
            ],
        },
        select: { userId: true },
    })

    if (!candidate) return

    await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`
            SELECT "id"
            FROM public."User"
            WHERE "id" = ${candidate.userId}
            FOR UPDATE
        `

        // Read again after acquiring the lock.
        const stored = await tx.refreshToken.findFirst({
            where: {
                userId: candidate.userId,
                OR: [
                    { tokenHash },
                    { token: refreshToken },
                ],
            },
        })

        if (!stored) return

        if (stored.sessionId) {
            await tx.authSession.updateMany({
                where: {
                    id: stored.sessionId,
                    userId: stored.userId,
                    revokedAt: null,
                },
                data: { revokedAt: new Date() },
            })
        } else {
            // Old tokens have no session to revoke.
            await tx.refreshToken.delete({
                where: { id: stored.id },
            })
        }
    }, {
        isolationLevel: 'ReadCommitted',
    })
},

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        // 1. check token exists in DB
        const stored = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: { select: userSelect } }
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

    // async resetPassword(userId: string, data: ResetPasswordDTO): Promise<void> {
    //     // 1. find user (select password only for verification)
    //     const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } })
    //     if (!user) throw new Error('User not found')

    //     // 2. verify old password
    //     const isValid = await comparePassword(data.oldPassword, user.password)
    //     if (!isValid) throw new Error('Old password is incorrect')

    //     // 3. hash and save new password
    //     const hashed = await hashPassword(data.newPassword)
    //     await prisma.user.update({
    //         where: { id: userId },
    //         data: { password: hashed }
    //     })

    //     // 4. revoke all refresh tokens (force re-login)
    //     await prisma.refreshToken.deleteMany({ where: { userId } })
    // }

    async resetPassword(
    userId: string,
    data: ResetPasswordDTO,
): Promise<void> {
    const newPasswordHash = await hashPassword(data.newPassword)

    await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`
            SELECT "id"
            FROM public."User"
            WHERE "id" = ${userId}
            FOR UPDATE
        `

        const user = await tx.user.findUnique({
            where: { id: userId },
            select: {
                password: true,
                status: true,
            },
        })

        if (!user) {
            throw new Error('User not found')
        }

        if (
            !user.status ||
            !(await comparePassword(data.oldPassword, user.password))
        ) {
            throw new Error('Old password is incorrect')
        }

        await tx.user.update({
            where: { id: userId },
            data: { password: newPasswordHash },
        })

        // Revoke all sessions belonging to this user.
        await tx.authSession.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        })

        // Remove legacy tokens while preserving rotation records.
        await tx.refreshToken.deleteMany({
            where: {
                userId,
                sessionId: null,
            },
        })
    }, {
        isolationLevel: 'ReadCommitted',
    })
},
}
