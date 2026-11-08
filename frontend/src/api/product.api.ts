import type { CreateProductDTO, Product, TVA, UpdateProductDTO } from "@/shared/types/product.types"
import type { ListParams, PaginatedResponse } from "@/shared/types/pagination.types"
import api from "./axios"
import { toQueryParams } from "./queryParams"

export type ProductSortField = "name" | "unit" | "unitPrice" | "createdAt"

export type ProductListParams = ListParams<ProductSortField> & {
    designationId?: number | undefined
    lotId?: number | undefined
    // Products that are unassigned or assigned to another lot.
    notInLotId?: number | undefined
    tva?: TVA | undefined
}

export const productApi = {
    list: async (params: ProductListParams = {}): Promise<PaginatedResponse<Product>> => {
        const { data } = await api.get<PaginatedResponse<Product>>("/products", {
            params: toQueryParams(params),
        })
        return data
    },

    getById: async (id: string | number): Promise<Product> => {
        const { data } = await api.get<Product>(`/products/${id}`)
        return data
    },

    create: async (productData: CreateProductDTO): Promise<Product> => {
        const { data } = await api.post<Product>("/products", productData)
        return data
    },

    update: async (id: string | number, productData: UpdateProductDTO): Promise<Product> => {
        const { data } = await api.put<Product>(`/products/${id}`, productData)
        return data
    },

    delete: async (id: string | number): Promise<void> => {
        await api.delete(`/products/${id}`)
    },
}
