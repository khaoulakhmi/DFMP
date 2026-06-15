import { Box, HStack } from "@chakra-ui/react"
import type { Column, SortDirection } from "@/shared/types/table.types"

const CHEVRON_UP   = "↑"
const CHEVRON_DOWN = "↓"
const CHEVRON_BOTH = "↕"

const thStyle = {
    padding:         "12px 16px",
    textAlign:       "left" as const,
    fontSize:        "11px",
    fontWeight:      600,
    color:           "#7d949d",
    textTransform:   "uppercase" as const,
    letterSpacing:   "0.06em",
    backgroundColor: "#fafcfd",
    whiteSpace:      "nowrap" as const,
    userSelect:      "none" as const,
}

interface TableHeadProps<T> {
    columns:        Column<T>[]
    hasActions:     boolean
    sortKey:        string | null
    sortDir:        SortDirection
    allSelected:    boolean
    someSelected:   boolean
    onSort:         (key: string) => void
    onSelectAll:    () => void
}

const TableHead = <T extends Record<string, unknown>>({
    columns,
    sortKey,
    sortDir,
    allSelected,
    someSelected,
    onSort,
    onSelectAll,
}: TableHeadProps<T>) => {
    return (
        <thead>
            <tr style={{ borderBottom: "1px solid #e3eaee" }}>

                {/* Checkbox column */}
                <th style={{ ...thStyle, width: "48px", padding: "12px 12px 12px 16px" }}>
                    <Box
                        w="4" h="4"
                        border="1.5px solid"
                        borderColor={allSelected || someSelected ? "primary.500" : "neutral.300"}
                        borderRadius="sm"
                        bg={allSelected ? "primary.500" : "white"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        transition="all 0.15s"
                        _hover={{ borderColor: "primary.400" }}
                        onClick={onSelectAll}
                        flexShrink={0}
                    >
                        {allSelected && (
                            <Box color="white" fontSize="9px" fontWeight="bold">✓</Box>
                        )}
                        {someSelected && !allSelected && (
                            <Box w="2" h="0.5" bg="primary.500" borderRadius="full" />
                        )}
                    </Box>
                </th>

                {columns.map(col => (
                    <th
                        key={String(col.key)}
                        style={{
                            ...thStyle,
                            width:  col.width,
                            cursor: col.sortable ? "pointer" : "default",
                        }}
                        onClick={() => col.sortable && onSort(String(col.key))}
                    >
                        <HStack gap={1} display="inline-flex">
                            <span>{col.label}</span>
                            {col.sortable && (
                                <span style={{
                                    color: sortKey === String(col.key) ? "#667f8f" : "#c1d4d9"
                                }}>
                                    {sortKey === String(col.key)
                                        ? sortDir === "asc" ? CHEVRON_UP : CHEVRON_DOWN
                                        : CHEVRON_BOTH
                                    }
                                </span>
                            )}
                        </HStack>
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHead
