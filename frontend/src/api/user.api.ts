import type { CreateUserDTO, User } from '@/shared/types/user.type'
import api from './axios'

export const userApi = {
    getAll: async () => {
        const { data } = await api.get('/users')
        return data
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/users/${id}`)
        return data
    },

    getByUsername: async (username: string) => {
        const { data } = await api.get(`/users/username/${username}`)
        return data
    },

    create: async (userData: CreateUserDTO) => {
        const { data } = await api.post('/users', userData)
        return data
    },

    update: async (id: string, userData: Partial<User>) => {
        const { data } = await api.put(`/users/${id}`, userData)
        return data
    },

    delete: async (id: string) => {
        await api.delete(`/users/${id}`)
    }
}