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