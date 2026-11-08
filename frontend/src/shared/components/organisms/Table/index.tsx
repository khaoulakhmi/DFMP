import { useEffect, useMemo, useState } from "react"
import { Box, Flex, HStack, Spinner, Text } from "@chakra-ui/react"
import { useI18n } from "@/shared/i18n/useI18n"
import Button from "@/shared/components/atoms/button"
import TableToolbar    from "./TableToolBar"
import TableHead       from "./TableHead"
import TableBody       from "./TableBody"
import TableEmpty      from "./TableEmpty"
import TablePagination from "./TablePagination"
import type { Column, TableProps, SortDirection } from "@/shared/types/table.types"

const sortFieldOf = <T,>(column: Column<T>) => column.sortField ?? String(column.key)

/**
 * Two modes:
 * - client (default): `data` is the full list; search, sort and paging run locally.
 * - server (`server` prop): `data` is one page from the API; search, sort and
 *   paging are sent to the API and the totals come from its pagination metadata.
 */
const Table = <T extends Record<string, unknown>>({
    data,
    columns,
    isLoading    = false,
    isError      = false,
    onRetry,
    searchable   = false,
    searchKeys   = [],
    pageSize     = 10,
    server,
    filters,
    keyExtractor = (row: T) => String(row.id ?? JSON.stringify(row)),
    actions,
    onEdit,
}: TableProps<T>) => {
    const { t } = useI18n()
    const isServer = server !== undefined

    // Client-mode state
    const [clientSearch,  setClientSearch]  = useState("")
    const [clientSortKey, setClientSortKey] = useState<string | null>(null)
    const [clientSortDir, setClientSortDir] = useState<SortDirection>(null)
    const [clientPage,    setClientPage]    = useState(1)

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    // ── Client search ──
    const filtered = useMemo(() => {
        if (isServer || !clientSearch.trim()) return data
        const term = clientSearch.toLowerCase()
        return data.filter(row =>
            searchKeys.some(key => String(row[key] ?? "").toLowerCase().includes(term))
        )
    }, [data, isServer, clientSearch, searchKeys])

    // ── Client sort ──
    const sorted = useMemo(() => {
        if (isServer || !clientSortKey || !clientSortDir) return filtered
        return [...filtered].sort((a, b) => {
            const aVal = String(a[clientSortKey] ?? "").toLowerCase()
            const bVal = String(b[clientSortKey] ?? "").toLowerCase()
            return clientSortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        })
    }, [filtered, isServer, clientSortKey, clientSortDir])

    // ── Paging ──
    const clientTotalPages = Math.ceil(sorted.length / pageSize)
    // Stay on a valid page when rows are removed from the last one.
    const clientCurrentPage = Math.min(clientPage, Math.max(clientTotalPages, 1))

    const page       = isServer ? server.page : clientCurrentPage
    const totalPages = isServer ? server.totalPages : clientTotalPages
    const total      = isServer ? server.total : sorted.length
    const search     = isServer ? server.search : clientSearch
    const rows       = isServer
        ? data
        : sorted.slice((clientCurrentPage - 1) * pageSize, clientCurrentPage * pageSize)

    // The server sort is held as a backend field; map it back to its column.
    const sortKey = isServer
        ? (columns.find(column => sortFieldOf(column) === server.sortBy)?.key as string | undefined) ?? null
        : clientSortKey
    const sortDir: SortDirection = isServer ? server.sortOrder : clientSortDir

    // After deleting the last row of the last page, go back one page.
    const serverPage       = server?.page
    const serverTotalPages = server?.totalPages
    const serverFetching   = server?.isFetching
    const onServerPage     = server?.onPageChange
    useEffect(() => {
        if (
            !onServerPage ||
            serverFetching ||
            serverPage === undefined ||
            serverTotalPages === undefined
        ) {
            return
        }

        const lastValidPage = Math.max(serverTotalPages, 1)

        if (serverPage > lastValidPage) {
            onServerPage(lastValidPage)
        }
    }, [
        onServerPage,
        serverFetching,
        serverPage,
        serverTotalPages,
    ])

    // ── Selection (always limited to the rows on screen) ──
    const selectedRows = rows.filter(row => selectedIds.has(keyExtractor(row)))
    const allSelected  = rows.length > 0 && rows.every(row => selectedIds.has(keyExtractor(row)))
    const someSelected = rows.some(row => selectedIds.has(keyExtractor(row)))

    const clearSelection = () => setSelectedIds(new Set())

    // ── Handlers ──
    const goToPage = (next: number) => {
        clearSelection()
        if (isServer) server.onPageChange(next)
        else setClientPage(next)
    }

    const handleSort = (key: string) => {
        clearSelection()
        const nextDir: SortDirection = sortKey !== key ? "asc" : sortDir === "asc" ? "desc" : null

        if (isServer) {
            const column = columns.find(col => String(col.key) === key)
            server.onSortChange(nextDir && column ? sortFieldOf(column) : null, nextDir)
            return
        }

        setClientSortKey(nextDir ? key : null)
        setClientSortDir(nextDir)
        setClientPage(1)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearSelection()
        if (isServer) {
            server.onSearchChange(e.target.value)
            return
        }
        setClientSearch(e.target.value)
        setClientPage(1)
    }

    const handleToggleRow = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleSelectAll = () => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            rows.forEach(row => {
                if (allSelected) next.delete(keyExtractor(row))
                else next.add(keyExtractor(row))
            })
            return next
        })
    }

    // ── Loading (first load only; later fetches keep the rows visible) ──
    if (isLoading) return (
        <Flex justify="center" align="center" h="48" bg="white" borderRadius="xl" border="1px solid" borderColor="neutral.200">
            <Flex direction="column" align="center" gap={3}>
                <Spinner color="primary.500" size="md" />
                <Text fontSize="sm" color="neutral.500">{t("common.loadingData")}</Text>
            </Flex>
        </Flex>
    )

    // ── Error with nothing to show ──
    if (isError && rows.length === 0) return (
        <Flex
            p={6} gap={4} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl"
            align={{ base: "stretch", sm: "center" }} justify="space-between" direction={{ base: "column", sm: "row" }}
        >
            <Text color="error.600" fontSize="sm" fontWeight="medium">
                {t("common.failedToLoad")}
            </Text>
            {onRetry && (
                <Box w={{ base: "full", sm: "32" }}>
                    <Button variant="secondary" size="sm" onClick={onRetry}>{t("common.retry")}</Button>
                </Box>
            )}
        </Flex>
    )

    const searchInputValue = isServer ? server.searchInput : clientSearch
    const isFiltered = Boolean(search) || Boolean(server?.hasActiveFilters)
    const showPagination = isServer ? total > 0 : totalPages > 1

    return (
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="neutral.200" overflow="hidden" boxShadow="sm" minW={0}>

            <TableToolbar
                total={total}
                search={search}
                searchValue={searchInputValue}
                searchable={searchable}
                selectedRows={selectedRows}
                filters={filters}
                onClearSelect={clearSelection}
                onChange={handleSearch}
                {...(onEdit   && { onEdit })}
                {...(actions  && { actions })}
            />

            {/* Refetch failed, but older rows are still on screen */}
            {isError && (
                <HStack px={{ base: 4, md: 6 }} py={2} bg="error.50" borderBottom="1px solid" borderColor="error.200" justify="space-between">
                    <Text color="error.600" fontSize="xs">{t("common.refreshFailed")}</Text>
                    {onRetry && (
                        <Box w="28">
                            <Button variant="ghost" size="sm" onClick={onRetry}>{t("common.retry")}</Button>
                        </Box>
                    )}
                </HStack>
            )}

            <Box
                overflowX="auto"
                w="full"
                opacity={server?.isFetching ? 0.6 : 1}
                transition="opacity 0.15s"
                aria-busy={server?.isFetching || undefined}
            >
                <table style={{ width: "100%", minWidth: "720px", borderCollapse: "collapse" }}>
                    <TableHead
                        columns={columns}
                        hasActions={false}
                        sortKey={sortKey}
                        sortDir={sortDir}
                        allSelected={allSelected}
                        someSelected={someSelected}
                        onSort={handleSort}
                        onSelectAll={handleSelectAll}
                    />
                    <TableBody
                        rows={rows}
                        columns={columns}
                        selectedIds={selectedIds}
                        deleteId={null}
                        keyExtractor={keyExtractor}
                        onToggleRow={handleToggleRow}
                    />
                </table>
            </Box>

            {rows.length === 0 && <TableEmpty search={search} filtered={isFiltered} />}

            {showPagination && (
                <TablePagination
                    page={page}
                    totalPages={Math.max(totalPages, 1)}
                    total={total}
                    pageSize={isServer ? server.pageSize : pageSize}
                    onPrev={() => goToPage(page - 1)}
                    onNext={() => goToPage(page + 1)}
                    onPage={goToPage}
                    {...(isServer && server.onPageSizeChange && {
                        pageSizeOptions: server.pageSizeOptions,
                        onPageSizeChange: (next: number) => {
                            clearSelection()
                            server.onPageSizeChange?.(next)
                        },
                    })}
                />
            )}
        </Box>
    )
}

export default Table
