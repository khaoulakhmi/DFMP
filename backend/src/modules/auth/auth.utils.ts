import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload, AuthTokens } from './auth.types'
import { env } from '../../config/env';

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

export const getRefreshTokenExpiry = (): Date => {
    const date = new Date()
    date.setDate(date.getDate() + 7) // 7 days from now
    return date
}