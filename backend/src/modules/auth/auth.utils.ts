import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload,AuthenticationError, RefreshTokenPayload, AuthTokens } from './auth.types'
import { env } from '../../config/env';
import { createHash, randomUUID } from 'node:crypto'



export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export const generateTokens = (payload: TokenPayload): AuthTokens => {

    const accessToken = jwt.sign(
        payload ,
        env.accessTokenSecret ,
        { expiresIn: env.accessTokenExpiresIn as SignOptions['expiresIn'] }
    )

    const refreshToken = jwt.sign(
        payload,
        env.refreshTokenSecret ,
        { expiresIn: env.refreshTokenExpiresIn as SignOptions['expiresIn'] }
    )

    return { accessToken, refreshToken }
}

export const generateRefreshToken = (
    userId: string,
    session: { id: string; expiresAt: Date },
): string => {
    return jwt.sign(
        {
            userId,
            sessionId: session.id,
            jti: randomUUID(),
            exp: Math.floor(session.expiresAt.getTime() / 1000),
        },
        env.refreshTokenSecret,
        { algorithm: 'HS256' },
    )
}

export const generateAccessToken = (
    payload: TokenPayload,
): string => {
    return jwt.sign(
        payload,
        env.accessTokenSecret,
        {
            algorithm: 'HS256',
            expiresIn: env.accessTokenExpiresIn as SignOptions['expiresIn'],
        },
    )
}

export const hashRefreshToken = (token: string): string => {
    return createHash('sha256')
        .update(token)
        .digest('hex')
}

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload
}

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string
    ) as TokenPayload
}

export const verifyRotationRefreshToken = (
    token: string,
): RefreshTokenPayload => {
    let decoded: jwt.JwtPayload | string

    try {
        decoded = jwt.verify(
            token,
            env.refreshTokenSecret,
            { algorithms: ['HS256'] },
        )
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AuthenticationError(
                'Invalid or expired refresh token',
            )
        }

        throw error
    }

    if (
        typeof decoded === 'string' ||
        typeof decoded.userId !== 'string' ||
        decoded.userId.length === 0 ||
        typeof decoded.sessionId !== 'string' ||
        decoded.sessionId.length === 0 ||
        typeof decoded.jti !== 'string' ||
        decoded.jti.length === 0 ||
        typeof decoded.exp !== 'number' ||
        !Number.isSafeInteger(decoded.exp)
    ) {
        throw new AuthenticationError(
            'Invalid refresh token payload',
        )
    }

    return {
        userId: decoded.userId,
        sessionId: decoded.sessionId,
        jti: decoded.jti,
        exp: decoded.exp,
    }
}

export const getRefreshTokenExpiry = (): Date => {
    return new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS)
}
