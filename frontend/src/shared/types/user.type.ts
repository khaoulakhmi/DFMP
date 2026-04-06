// shared/types/user.types.ts

export const Role = {
    ADMIN: 'ADMIN',
    SALES: 'SALES',
    FINANCE: 'FINANCE',
    ACCOUNTANT: 'ACCOUNTANT'
} as const

export type Role = typeof Role[keyof typeof Role]

export interface User {
    id: string       
    name: string
    username: string
    role: Role
    status: boolean
    createdAt: string
    updatedAt: string
}

export interface CreateUserDTO {
    name: string
    username: string
    password: string
    role: Role
}

export interface UpdateUserDTO {
    name?: string
    username?: string
    password?: string
    role?: Role
    status?: boolean
}