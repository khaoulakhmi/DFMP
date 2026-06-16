import type { CreateSpecificationDTO, Specification, UpdateSpecificationDTO } from "@/shared/types/specification.types"
import api from "./axios"

export const specificationApi = {
    getAll: async (): Promise<Specification[]> => {
        const { data } = await api.get("/specifications")
        return data
    },

    getById: async (id: string | number): Promise<Specification> => {
        const { data } = await api.get(`/specifications/${id}`)
        return data
    },

    create: async (specificationData: CreateSpecificationDTO): Promise<Specification> => {
        const { data } = await api.post("/specifications", specificationData)
        return data
    },

    update: async (id: string | number, specificationData: UpdateSpecificationDTO): Promise<Specification> => {
        const { data } = await api.put(`/specifications/${id}`, specificationData)
        return data
    },

    delete: async (id: string | number) => {
        await api.delete(`/specifications/${id}`)
    },
}
