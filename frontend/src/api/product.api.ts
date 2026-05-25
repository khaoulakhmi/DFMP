import type { CreateProductDTO, UpdateProductDTO } from '@/shared/types/product.types'
import api from './axios'


export const productApi = {
    getAll: async () => {
        const { data } = await api.get('/products')
        return data
    },

    getById: async (id: number) => {
        const { data } = await api.get(`/products/${id}`)
        return data
    },

    create: async (productData: CreateProductDTO) => {
        const { data } = await api.post('/products', productData)
        return data
    },

    update: async (id: number, productData: UpdateProductDTO) => {
        const { data } = await api.put(`/products/${id}`, productData)
        return data
    },

    delete: async (id: number) => {
        await api.delete(`/products/${id}`)
    }
}
