import type { CreateDesignationDTO, Designation, UpdateDesignationDTO } from "@/shared/types/designation.types"
import type { ListParams, PaginatedResponse } from "@/shared/types/pagination.types"
import api from "./axios"
import { toQueryParams } from "./queryParams"

export type DesignationSortField = "id" | "name"
export type DesignationListParams = ListParams<DesignationSortField>

export const designationApi = {
    list: async (params: DesignationListParams = {}): Promise<PaginatedResponse<Designation>> => {
        const { data } = await api.get<PaginatedResponse<Designation>>("/designations", {
            params: toQueryParams(params),
        })
        return data
    },

    getById: async (id: string | number): Promise<Designation> => {
        const { data } = await api.get<Designation>(`/designations/${id}`)
        return data
    },

    create: async (designationData: CreateDesignationDTO): Promise<Designation> => {
        const { data } = await api.post<Designation>("/designations", designationData)
        return data
    },

    update: async (id: string | number, designationData: UpdateDesignationDTO): Promise<Designation> => {
        const { data } = await api.put<Designation>(`/designations/${id}`, designationData)
        return data
    },

    delete: async (id: string | number): Promise<void> => {
        await api.delete(`/designations/${id}`)
    },
}
