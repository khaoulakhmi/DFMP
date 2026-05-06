import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import TextField from "@/shared/components/molecules/Forms/textField"
import Button from "@/shared/components/atoms/button"
import type { TableAction } from "@/shared/types/table.types"

// TableToolbar.tsx
interface TableToolbarProps<T> {
    total:          number
    search:         string
    searchable:     boolean
    selectedRows:   T[]
    actions?:       TableAction<T>[]    // 👈 ? instead of no ?
    onEdit?:        (row: T) => void    // 👈 ? instead of no ?
    onClearSelect:  () => void
    onChange:       (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TableToolbar = <T extends Record<string, unknown>>({
    total,
    search,
    searchable,
    selectedRows,
    actions,
    onEdit,
    onClearSelect,
    onChange,
}: TableToolbarProps<T>) => {
    const hasSelection = selectedRows.length > 0

    return (
        <Flex
            px={6} py={4}
            bg={hasSelection ? "primary.50" : "neutral.50"}
            borderBottom="1px solid"
            borderColor={hasSelection ? "primary.200" : "neutral.200"}
            justify="space-between"
            align="center"
            gap={4}
            flexWrap="wrap"
            transition="all 0.2s ease"
        >
            {/* Left — count or selection info */}
            <HStack gap={3}>
                {hasSelection ? (
                    <>
                        {/* Clear selection */}
                        <Box
                            w="5" h="5"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius="md"
                            cursor="pointer"
                            color="primary.600"
                            fontSize="xs"
                            border="1px solid"
                            borderColor="primary.300"
                            _hover={{ bg: "primary.100" }}
                            onClick={onClearSelect}
                        >
                            ✕
                        </Box>
                        <Text fontSize="sm" fontWeight="medium" color="primary.700">
                            {selectedRows.length} selected
                        </Text>
                    </>
                ) : (
                    <Text fontSize="sm" fontWeight="medium" color="neutral.600">
                        {total} {total === 1 ? "record" : "records"}
                        {search && ` matching "${search}"`}
                    </Text>
                )}
            </HStack>

            {/* Right — actions or search */}
            {hasSelection ? (
                <HStack gap={2}>
                    {/* Edit — only for single selection */}
                    {onEdit && selectedRows.length === 1 && (
                        <Box w="20">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    const row = selectedRows[0]
                                    if (row) onEdit(row)
                                }}
                            >
                                ✏️ Edit
                            </Button>
                        </Box>
                    )}

                    {/* Custom actions */}
                    {actions && actions
                        .filter(action => !action.showWhen || action.showWhen(selectedRows))
                        .map((action, i) => (
                            <Box key={i} w="auto" minW="20">
                                <Button
                                    variant={action.variant ?? "secondary"}
                                    size="sm"
                                    onClick={() => action.onClick(selectedRows)}
                                >
                                    {action.icon && `${action.icon} `}{action.label}
                                </Button>
                            </Box>
                        ))
                    }
                </HStack>
            ) : (
                searchable && (
                    <Box w="64">
                        <TextField
                            placeholder="Search..."
                            value={search}
                            onChange={onChange}
                        />
                    </Box>
                )
            )}
        </Flex>
    )
}

export default TableToolbar