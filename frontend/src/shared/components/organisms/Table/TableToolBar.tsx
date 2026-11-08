import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"
import TextField from "@/shared/components/molecules/Forms/textField"
import Button from "@/shared/components/atoms/button"
import type { TableAction } from "@/shared/types/table.types"
import { useI18n } from "@/shared/i18n/useI18n"

// TableToolbar.tsx
interface TableToolbarProps<T> {
    total:          number
    // Search that produced the current rows (shown in the count).
    search:         string
    // What is typed in the box; can run ahead of `search` while debouncing.
    searchValue?:   string
    searchable:     boolean
    filters?:       ReactNode
    selectedRows:   T[]
    actions?:       TableAction<T>[]    // 👈 ? instead of no ?
    onEdit?:        (row: T) => void    // 👈 ? instead of no ?
    onClearSelect:  () => void
    onChange:       (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TableToolbar = <T extends Record<string, unknown>>({
    total,
    search,
    searchValue,
    searchable,
    filters,
    selectedRows,
    actions,
    onEdit,
    onClearSelect,
    onChange,
}: TableToolbarProps<T>) => {
    const { t } = useI18n()
    const hasSelection = selectedRows.length > 0

    return (
        <Flex
            px={{ base: 4, md: 6 }} py={4}
            bg={hasSelection ? "primary.50" : "neutral.50"}
            borderBottom="1px solid"
            borderColor={hasSelection ? "primary.200" : "neutral.200"}
            justify="space-between"
            align={{ base: "stretch", sm: "center" }}
            direction={{ base: "column", sm: "row" }}
            gap={4}
            flexWrap="wrap"
            transition="all 0.2s ease"
        >
            {/* Left — count or selection info */}
            <HStack gap={3} minW={0}>
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
                            {selectedRows.length} {t("common.selected")}
                        </Text>
                    </>
                ) : (
                    <Text fontSize="sm" fontWeight="medium" color="neutral.600">
                        {total} {t(total === 1 ? "common.record" : "common.records")}
                        {search && ` ${t("common.matching", { search })}`}
                    </Text>
                )}
            </HStack>

            {/* Right — actions or search */}
            {hasSelection ? (
                <HStack gap={2} flexWrap="wrap" justify={{ base: "stretch", sm: "flex-end" }}>
                    {/* Edit — only for single selection */}
                    {onEdit && selectedRows.length === 1 && (
                        <Box w={{ base: "full", sm: "20" }}>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    const row = selectedRows[0]
                                    if (row) onEdit(row)
                                }}
                            >
                                ✏️ {t("common.edit")}
                            </Button>
                        </Box>
                    )}

                    {/* Custom actions */}
                    {actions && actions
                        .filter(action => !action.showWhen || action.showWhen(selectedRows))
                        .map((action, i) => (
                            <Box key={i} w={{ base: "full", sm: "auto" }} minW="20">
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
                (searchable || filters) && (
                    <HStack gap={2} flexWrap="wrap" justify={{ base: "stretch", sm: "flex-end" }}>
                        {filters}
                        {searchable && (
                            <Box w={{ base: "full", sm: "64" }}>
                                <TextField
                                    placeholder={t("common.searchPlaceholder")}
                                    value={searchValue ?? search}
                                    onChange={onChange}
                                    aria-label={t("common.searchPlaceholder")}
                                />
                            </Box>
                        )}
                    </HStack>
                )
            )}
        </Flex>
    )
}

export default TableToolbar
