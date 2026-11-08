import type { CreateSpecificationDTO, Specification, UpdateSpecificationDTO } from "@/shared/types/specification.types"
import type { ListParams, PaginatedResponse } from "@/shared/types/pagination.types"
import api from "./axios"
import { toQueryParams } from "./queryParams"

export type SpecificationSortField = "year" | "type" | "minAmount" | "maxAmount" | "id"

export type SpecificationListParams = ListParams<SpecificationSortField> & {
    designationId?: number | undefined
    year?: number | undefined
    type?: string | undefined
    hasTendering?: boolean | undefined
}

export const specificationApi = {
    list: async (params: SpecificationListParams = {}): Promise<PaginatedResponse<Specification>> => {
        const { data } = await api.get<PaginatedResponse<Specification>>("/specifications", {
            params: toQueryParams(params),
        })
        return data
    },

    getById: async (id: string | number): Promise<Specification> => {
        const { data } = await api.get<Specification>(`/specifications/${id}`)
        return data
    },

    create: async (specificationData: CreateSpecificationDTO): Promise<Specification> => {
        const { data } = await api.post<Specification>("/specifications", specificationData)
        return data
    },

    update: async (id: string | number, specificationData: UpdateSpecificationDTO): Promise<Specification> => {
        const { data } = await api.put<Specification>(`/specifications/${id}`, specificationData)
        return data
    },

    delete: async (id: string | number): Promise<void> => {
        await api.delete(`/specifications/${id}`)
    },
}
