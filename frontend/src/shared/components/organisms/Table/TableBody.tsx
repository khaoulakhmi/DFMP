import { Box } from "@chakra-ui/react"
import type { Column } from "@/shared/types/table.types"

interface TableBodyProps<T> {
    rows:           T[]
    columns:        Column<T>[]
    selectedIds:    Set<string>        // 👈 selected row ids
    deleteId:       string | null
    keyExtractor:   (row: T) => string
    onToggleRow:    (id: string) => void // 👈 toggle single row
}

const tdStyle = {
    padding:    "14px 24px",
    fontSize:   "14px",
    color:      "#3a5258",
    whiteSpace: "nowrap" as const,
}

const TableBody = <T extends Record<string, unknown>>({
    rows,
    columns,
    selectedIds,
    keyExtractor,
    onToggleRow,
}: TableBodyProps<T>) => {
    return (
        <tbody>
            {rows.map(row => {
                const id         = keyExtractor(row)
                const isSelected = selectedIds.has(id)

                return (
                    <tr
                        key={id}
                        style={{
                            borderBottom:    "1px solid #f1f5f7",
                            background:      isSelected ? "#f1f5f7" : "white",
                            transition:      "background 0.15s"
                        }}
                        onMouseEnter={e => {
                            if (!isSelected) e.currentTarget.style.background = "#fafcfd"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = isSelected ? "#f1f5f7" : "white"
                        }}
                    >
                        {/* Checkbox */}
                        <td style={{ padding: "14px 16px 14px 24px", width: "48px" }}>
                            <Box
                                w="4" h="4"
                                border="1.5px solid"
                                borderColor={isSelected ? "primary.500" : "neutral.300"}
                                borderRadius="sm"
                                bg={isSelected ? "primary.500" : "white"}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                transition="all 0.15s"
                                _hover={{ borderColor: "primary.400" }}
                                onClick={() => onToggleRow(id)}
                                flexShrink={0}
                            >
                                {isSelected && (
                                    <Box color="white" fontSize="9px" fontWeight="bold">✓</Box>
                                )}
                            </Box>
                        </td>

                        {/* Cells */}
                        {columns.map(col => (
                            <td key={String(col.key)} style={tdStyle}>
                                {col.render
                                    ? col.render(row[col.key as keyof T] as T[keyof T], row)
                                    : String(row[col.key as keyof T] ?? "—")
                                }
                            </td>
                        ))}
                    </tr>
                )
            })}
        </tbody>
    )
}

export default TableBody