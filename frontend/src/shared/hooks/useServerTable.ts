import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ListParams, PaginationMeta, SortOrder } from "@/shared/types/pagination.types"
import type { ServerTableState } from "@/shared/types/table.types"

const SEARCH_DEBOUNCE_MS = 300

type Options<TSortBy extends string, TFilters extends object> = {
    pageSize?: number
    pageSizeOptions?: number[]
    // Used when the user clears the column sort.
    defaultSort?: { sortBy: TSortBy; sortOrder: SortOrder }
    initialFilters?: TFilters
}

/**
 * Owns page, page size, search, sort and filters for a server-paginated
 * table. Any change other than the page itself goes back to page 1.
 *
 * `params` goes into the query key and the API call; `tableState()` feeds
 * the shared Table component.
 */
export const useServerTable = <TSortBy extends string, TFilters extends object = Record<never, never>>(
    options: Options<TSortBy, TFilters> = {},
) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSizeState] = useState(options.pageSize ?? 10)
    const [searchInput, setSearchInputState] = useState("")
    const [search, setSearch] = useState("")
    const [sort, setSortState] = useState<{ sortBy: TSortBy; sortOrder: SortOrder } | null>(null)
    const [filters, setFiltersState] = useState<TFilters>(options.initialFilters ?? ({} as TFilters))
    const searchTimer = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(searchTimer.current), [])

    const setSearchInput = useCallback((value: string) => {
        setSearchInputState(value)
        window.clearTimeout(searchTimer.current)
        searchTimer.current = window.setTimeout(() => {
            setSearch(value.trim())
            setPage(1)
        }, SEARCH_DEBOUNCE_MS)
    }, [])

    const setPageSize = useCallback((value: number) => {
        setPageSizeState(value)
        setPage(1)
    }, [])

    const setSort = useCallback((sortBy: TSortBy | null, sortOrder: SortOrder | null) => {
        setSortState(sortBy && sortOrder ? { sortBy, sortOrder } : null)
        setPage(1)
    }, [])

    const setFilter = useCallback(<K extends keyof TFilters>(key: K, value: TFilters[K]) => {
        setFiltersState(previous => ({ ...previous, [key]: value }))
        setPage(1)
    }, [])

    const effectiveSort = sort ?? options.defaultSort ?? null

    const params = useMemo(() => ({
        page,
        pageSize,
        ...(search ? { search } : {}),
        ...(effectiveSort ?? {}),
        ...filters,
    }) as ListParams<TSortBy> & TFilters, [effectiveSort, filters, page, pageSize, search])

    const hasActiveFilters = Boolean(search) || Object.values(filters).some(
        value => value !== undefined && value !== null && value !== "",
    )

    const tableState = (pagination: PaginationMeta | undefined, isFetching = false): ServerTableState => ({
        page,
        pageSize,
        pageSizeOptions: options.pageSizeOptions ?? [10, 20, 50, 100],
        total: pagination?.total ?? 0,
        totalPages: pagination?.totalPages ?? 0,
        searchInput,
        search,
        hasActiveFilters,
        sortBy: sort?.sortBy ?? null,
        sortOrder: sort?.sortOrder ?? null,
        isFetching,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
        onSearchChange: setSearchInput,
        onSortChange: (sortBy, sortOrder) => setSort(sortBy as TSortBy | null, sortOrder),
    })

    return {
        params,
        filters,
        setFilter,
        setPage,
        tableState,
    }
}
