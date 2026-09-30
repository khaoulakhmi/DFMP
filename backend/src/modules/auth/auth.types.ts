export interface LoginDTO {
    username: string
    password: string
}

export interface ResetPasswordDTO {
    oldPassword: string
    newPassword: string
}

export interface TokenPayload {
    userId: string
    role: string
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

import { PublicUser } from '../user/user.types'

export interface LoginResponse {
    user: PublicUser
    tokens: Pick<AuthTokens, 'accessToken'>
}

export interface LoginServiceResult {
    user: PublicUser
    tokens: AuthTokens
}
export interface RefreshTokenPayload {
    userId: string
    sessionId: string
    jti: string
    exp: number
}

export interface RotationLoginResult {
    user: PublicUser
    tokens: AuthTokens
    refreshExpiresAt: Date
}

export class AuthenticationError extends Error {}

export interface RotationRefreshResult {
    tokens: AuthTokens
    refreshExpiresAt: Date
}