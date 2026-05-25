import type { CreateLotDTO, Lot } from '@/shared/types/lot.types'
import api from './axios'


export const lotApi = {
    getAll: async () => {
        const { data } = await api.get('/lots')
        return data
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/lots/${id}`)
        return data
    },

    create: async (lotData: CreateLotDTO) => {
        const { data } = await api.post('/lots', lotData)
        return data
    },

    update: async (id: string, lotData: Partial<Lot>) => {
        const { data } = await api.put(`/lots/${id}`, lotData)
        return data
    },

    delete: async (id: string) => {
        await api.delete(`/lots/${id}`)
    }
}