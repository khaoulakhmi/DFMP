import type { CreateDesignationDTO, UpdateDesignationDTO } from '@/shared/types/designation.types'
import api from './axios'

export const designationApi = {
    getAll: async () => {
        const { data } = await api.get('/designations')
        return data
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/designations/${id}`)
        return data
    },

    create: async (designationData: CreateDesignationDTO) => {
        const { data } = await api.post('/designations', designationData)
        return data
    },

    update: async (id: string, designationData: UpdateDesignationDTO) => {
        const { data } = await api.put(`/designations/${id}`, designationData)
        return data
    },

    delete: async (id: string) => {
        await api.delete(`/designations/${id}`)
    }
}