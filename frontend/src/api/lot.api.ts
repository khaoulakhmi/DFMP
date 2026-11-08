import type { CreateLotDTO, Lot, UpdateLotDTO } from "@/shared/types/lot.types"
import type { ListParams, PaginatedResponse } from "@/shared/types/pagination.types"
import api from "./axios"
import { toQueryParams } from "./queryParams"

export type LotSortField = "name" | "createdAt"

export type LotListParams = ListParams<LotSortField> & {
    designationId?: number | undefined
    specificationsId?: number | undefined
    hasSpecification?: boolean | undefined
}

export const lotApi = {
    list: async (params: LotListParams = {}): Promise<PaginatedResponse<Lot>> => {
        const { data } = await api.get<PaginatedResponse<Lot>>("/lots", {
            params: toQueryParams(params),
        })
        return data
    },

    getById: async (id: string | number): Promise<Lot> => {
        const { data } = await api.get<Lot>(`/lots/${id}`)
        return data
    },

    create: async (lotData: CreateLotDTO): Promise<Lot> => {
        const { data } = await api.post<Lot>("/lots", lotData)
        return data
    },

    update: async (id: string | number, lotData: UpdateLotDTO): Promise<Lot> => {
        const { data } = await api.put<Lot>(`/lots/${id}`, lotData)
        return data
    },

    delete: async (id: string | number): Promise<void> => {
        await api.delete(`/lots/${id}`)
    },
}
