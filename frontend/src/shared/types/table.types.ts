export interface Column<T> {
    key:        keyof T | string
    label:      string
    sortable?:  boolean
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

export interface TableProps<T> {
    data:           T[]
    columns:        Column<T>[]
    isLoading?:     boolean
    isError?:       boolean
    searchable?:    boolean
    searchKeys?:    (keyof T)[]
    pageSize?:      number
    keyExtractor?:  (row: T) => string
    actions?:       TableAction<T>[]       // 👈 custom actions
    onEdit?:        (row: T) => void       // 👈 single row edit
    onDelete?:      (row: T) => void       // 👈 single row delete
}

export type SortDirection = 'asc' | 'desc' | null