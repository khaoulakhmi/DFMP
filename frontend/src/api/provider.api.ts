import type { CreateProviderDTO, Provider, UpdateProviderDTO } from "@/shared/types/provider.types"
import type { ListParams, PaginatedResponse } from "@/shared/types/pagination.types"
import api from "./axios"
import { toQueryParams } from "./queryParams"

export type ProviderSortField = "name" | "company" | "email" | "createdAt"

export type ProviderListParams = ListParams<ProviderSortField> & {
    company?: string | undefined
}

export const providerApi = {
    list: async (params: ProviderListParams = {}): Promise<PaginatedResponse<Provider>> => {
        const { data } = await api.get<PaginatedResponse<Provider>>("/providers", {
            params: toQueryParams(params),
        })
        return data
    },

    getById: async (id: string): Promise<Provider> => {
        const { data } = await api.get<Provider>(`/providers/${id}`)
        return data
    },

    create: async (providerData: CreateProviderDTO): Promise<Provider> => {
        const { data } = await api.post<Provider>("/providers", providerData)
        return data
    },

    update: async (id: string, providerData: UpdateProviderDTO): Promise<Provider> => {
        const { data } = await api.put<Provider>(`/providers/${id}`, providerData)
        return data
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/providers/${id}`)
    },
}
