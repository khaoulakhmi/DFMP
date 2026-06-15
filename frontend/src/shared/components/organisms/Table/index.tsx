import { useState, useMemo } from "react"
import { Box, Flex, Spinner, Text } from "@chakra-ui/react"
import TableToolbar    from "./TableToolBar"
import TableHead       from "./TableHead"
import TableBody       from "./TableBody"
import TableEmpty      from "./TableEmpty"
import TablePagination from "./TablePagination"
import type { TableProps, SortDirection } from "@/shared/types/table.types"

const Table = <T extends Record<string, unknown>>({
    data,
    columns,
    isLoading    = false,
    isError      = false,
    searchable   = false,
    searchKeys   = [],
    pageSize     = 10,
    keyExtractor = (row: T) => String(row.id ?? JSON.stringify(row)),
    actions,
    onEdit,
    
}: TableProps<T>) => {

    const [search,      setSearch]      = useState("")
    const [sortKey,     setSortKey]     = useState<string | null>(null)
    const [sortDir,     setSortDir]     = useState<SortDirection>(null)
    const [page,        setPage]        = useState(1)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    // ── Search ──
    const filtered = useMemo(() => {
        if (!search.trim()) return data
        return data.filter(row =>
            searchKeys.some(key =>
                String(row[key] ?? "").toLowerCase().includes(search.toLowerCase())
            )
        )
    }, [data, search, searchKeys])

    // ── Sort ──
    const sorted = useMemo(() => {
        if (!sortKey || !sortDir) return filtered
        return [...filtered].sort((a, b) => {
            const aVal = String(a[sortKey] ?? "").toLowerCase()
            const bVal = String(b[sortKey] ?? "").toLowerCase()
            return sortDir === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
        })
    }, [filtered, sortKey, sortDir])

    // ── Pagination ──
    const totalPages = Math.ceil(sorted.length / pageSize)
    const paginated  = sorted.slice((page - 1) * pageSize, page * pageSize)

    // ── Selected rows ──
    const selectedRows  = data.filter(row => selectedIds.has(keyExtractor(row)))
    const allSelected   = paginated.length > 0 && paginated.every(row => selectedIds.has(keyExtractor(row)))
    const someSelected  = paginated.some(row => selectedIds.has(keyExtractor(row)))

    // ── Handlers ──
    const handleSort = (key: string) => {
        if (sortKey !== key) { setSortKey(key); setSortDir("asc") }
        else if (sortDir === "asc") setSortDir("desc")
        else { setSortKey(null); setSortDir(null) }
        setPage(1)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handleToggleRow = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const handleSelectAll = () => {
        if (allSelected) {
            // deselect all on current page
            setSelectedIds(prev => {
                const next = new Set(prev)
                paginated.forEach(row => next.delete(keyExtractor(row)))
                return next
            })
        } else {
            // select all on current page
            setSelectedIds(prev => {
                const next = new Set(prev)
                paginated.forEach(row => next.add(keyExtractor(row)))
                return next
            })
        }
    }

    const handleClearSelect = () => setSelectedIds(new Set())

    // ── Loading ──
    if (isLoading) return (
        <Flex justify="center" align="center" h="48" bg="white" borderRadius="xl" border="1px solid" borderColor="neutral.200">
            <Flex direction="column" align="center" gap={3}>
                <Spinner color="primary.500" size="md" />
                <Text fontSize="sm" color="neutral.500">Loading data...</Text>
            </Flex>
        </Flex>
    )

    // ── Error ──
    if (isError) return (
        <Box p={6} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl">
            <Text color="error.600" fontSize="sm" fontWeight="medium">
                Failed to load data. Please try again.
            </Text>
        </Box>
    )

    return (
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="neutral.200" overflow="hidden" boxShadow="sm" minW={0}>

            <TableToolbar
                total={sorted.length}
                search={search}
                searchable={searchable}
                selectedRows={selectedRows}
                onClearSelect={handleClearSelect}
                onChange={handleSearch}
                {...(onEdit   && { onEdit })}    // 👈 only pass if defined
                {...(actions  && { actions })}   //
            />

            <Box overflowX="auto" w="full">
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
                        rows={paginated}
                        columns={columns}
                        selectedIds={selectedIds}
                        deleteId={null}
                        keyExtractor={keyExtractor}
                        onToggleRow={handleToggleRow}
                    />
                </table>
            </Box>

            {paginated.length === 0 && <TableEmpty search={search} />}

            {totalPages > 1 && (
                <TablePagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={() => setPage(p => p - 1)}
                    onNext={() => setPage(p => p + 1)}
                    onPage={setPage}
                />
            )}
        </Box>
    )
}

export default Table
