import api from './axios'
import type { CreateProviderDTO, Provider } from '@/shared/types/provider.types'

export const providerApi = {
    getAll: async () => {
        const { data } = await api.get('/providers')
        return data
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/providers/${id}`)
        return data
    },

    create: async (providerData: CreateProviderDTO) => {
        const { data } = await api.post('/providers', providerData)
        return data
    },

    update: async (id: string, providerData: Partial<Provider>) => {
        const { data } = await api.put(`/providers/${id}`, providerData)
        return data
    },

    delete: async (id: string) => {
        await api.delete(`/providers/${id}`)
    }   
}