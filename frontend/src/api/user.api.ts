import type { CreateUserDTO, Role, UpdateUserDTO, User } from "@/shared/types/user.type"
import type { ListParams, PaginatedResponse } from "@/shared/types/pagination.types"
import api from "./axios"
import { toQueryParams } from "./queryParams"

export type UserSortField = "name" | "username" | "role" | "createdAt"

export type UserListParams = ListParams<UserSortField> & {
    role?: Role | undefined
    status?: boolean | undefined
}

export const userApi = {
    list: async (params: UserListParams = {}): Promise<PaginatedResponse<User>> => {
        const { data } = await api.get<PaginatedResponse<User>>("/users", {
            params: toQueryParams(params),
        })
        return data
    },

    getById: async (id: string): Promise<User> => {
        const { data } = await api.get<User>(`/users/${id}`)
        return data
    },

    getByUsername: async (username: string): Promise<User> => {
        const { data } = await api.get<User>(`/users/username/${username}`)
        return data
    },

    create: async (userData: CreateUserDTO): Promise<User> => {
        const { data } = await api.post<User>("/users", userData)
        return data
    },

    update: async (id: string, userData: Partial<UpdateUserDTO>): Promise<User> => {
        const { data } = await api.put<User>(`/users/${id}`, userData)
        return data
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`)
    },
}
