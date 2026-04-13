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

export interface LoginResponse {
    user: {
        id: string
        username: string
        name: string
        role: string
    }
    tokens: AuthTokens
}