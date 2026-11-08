export type SortOrder = "asc" | "desc"

export interface PaginationMeta {
    page: number
    pageSize: number
    total: number
    totalPages: number
}

// Body returned by every list endpoint.
export interface PaginatedResponse<T> {
    data: T[]
    pagination: PaginationMeta
}

// Query parameters shared by every list endpoint. Each module narrows
// `sortBy` to the fields its backend accepts and adds its own filters.
export interface ListParams<TSortBy extends string = string> {
    page?: number | undefined
    pageSize?: number | undefined
    search?: string | undefined
    sortBy?: TSortBy | undefined
    sortOrder?: SortOrder | undefined
}

// Backend limit for pageSize.
export const MAX_PAGE_SIZE = 100
