import type { ReactNode } from "react"
import type { SortOrder } from "./pagination.types"

export interface Column<T> {
    key:        keyof T | string
    label:      string
    sortable?:  boolean
    // Backend sort field for server tables, when it differs from `key`.
    sortField?: string
    render?:    (value: T[keyof T], row: T) => React.ReactNode
    width?:     string
}

export interface TableAction<T> {
    label:      string
    icon?:      string
    variant?:   "primary" | "secondary" | "danger" | "ghost" | "accent"
    onClick:    (rows: T[]) => void        // 👈 receives selected rows
    showWhen?:  (rows: T[]) => boolean     // 👈 optional condition to show action
}

/**
 * Controlled state for a server-paginated table. `data` is then the
 * current page only, and search, sort and paging are done by the API.
 * Build it with `useServerTable().tableState(...)`.
 */
export interface ServerTableState {
    page:               number
    pageSize:           number
    pageSizeOptions?:   number[]
    total:              number
    totalPages:         number
    searchInput:        string
    search:             string
    hasActiveFilters?:  boolean
    sortBy:             string | null
    sortOrder:          SortOrder | null
    isFetching?:        boolean
    onPageChange:       (page: number) => void
    onPageSizeChange?:  (pageSize: number) => void
    onSearchChange:     (value: string) => void
    onSortChange:       (sortBy: string | null, sortOrder: SortOrder | null) => void
}

export interface TableProps<T> {
    data:           T[]
    columns:        Column<T>[]
    isLoading?:     boolean
    isError?:       boolean
    onRetry?:       () => void
    searchable?:    boolean
    // Client mode only: which fields the local search looks at.
    searchKeys?:    (keyof T)[]
    // Client mode only: rows per page.
    pageSize?:      number
    // Server mode: paging, search and sort are handled by the API.
    server?:        ServerTableState
    // Filter controls shown next to the search box.
    filters?:       ReactNode
    keyExtractor?:  (row: T) => string
    actions?:       TableAction<T>[]       // 👈 custom actions
    onEdit?:        (row: T) => void       // 👈 single row edit
    onDelete?:      (row: T) => void       // 👈 single row delete
}

export type SortDirection = 'asc' | 'desc' | null
