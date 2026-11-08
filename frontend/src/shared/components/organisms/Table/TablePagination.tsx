import { Box, chakra, Flex, HStack, Text } from "@chakra-ui/react"
import Button from "@/shared/components/atoms/button"
import { useI18n } from "@/shared/i18n/useI18n"

interface TablePaginationProps {
    page:               number
    totalPages:         number
    total?:             number
    pageSize?:          number
    pageSizeOptions?:   number[]
    onPrev:             () => void
    onNext:             () => void
    onPage:             (p: number) => void
    onPageSizeChange?:  (pageSize: number) => void
}

const TablePagination = ({
    page,
    totalPages,
    total,
    pageSize,
    pageSizeOptions,
    onPrev,
    onNext,
    onPage,
    onPageSizeChange,
}: TablePaginationProps) => {
    const { t } = useI18n()
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce<(number | string)[]>((acc, p, i, arr) => {
            if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...")
            acc.push(p)
            return acc
        }, [])

    const hasRange = total !== undefined && pageSize !== undefined && total > 0
    const from = hasRange ? Math.min((page - 1) * pageSize + 1, total) : 0
    const to = hasRange ? Math.min(page * pageSize, total) : 0

    return (
        <Flex
            px={{ base: 4, md: 6 }} py={4}
            borderTop="1px solid"
            borderColor="neutral.200"
            bg="neutral.50"
            justify="space-between"
            align={{ base: "stretch", sm: "center" }}
            direction={{ base: "column", sm: "row" }}
            gap={3}
        >
            <HStack gap={4} flexWrap="wrap">
                <Text fontSize="sm" color="neutral.500">
                    {t("common.pageOf", { page, total: totalPages })}
                    {hasRange && ` · ${t("common.showingRange", { from, to, total })}`}
                </Text>

                {onPageSizeChange && pageSizeOptions && pageSize !== undefined && (
                    <HStack gap={2}>
                        <chakra.label htmlFor="table-page-size" fontSize="sm" color="neutral.500">
                            {t("common.rowsPerPage")}
                        </chakra.label>
                        <select
                            id="table-page-size"
                            value={pageSize}
                            onChange={event => onPageSizeChange(Number(event.target.value))}
                            style={{
                                fontSize: "14px",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                border: "1px solid #e3eaee",
                                background: "white",
                            }}
                        >
                            {pageSizeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </HStack>
                )}
            </HStack>

            {totalPages > 1 && (
                <HStack gap={2} overflowX="auto" pb={{ base: 1, sm: 0 }}>
                    <Box w={{ base: "20", sm: "24" }} flexShrink={0}>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page <= 1}
                            onClick={onPrev}
                        >
                            ← {t("common.previous")}
                        </Button>
                    </Box>

                    {pages.map((p, i) =>
                        p === "..." ? (
                            <Text key={`ellipsis-${i}`} fontSize="sm" color="neutral.400" px={1}>
                                ...
                            </Text>
                        ) : (
                            <chakra.button
                                key={p}
                                type="button"
                                flexShrink={0}
                                w="8" h="8"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                                fontSize="sm"
                                fontWeight={page === p ? "semibold" : "normal"}
                                bg={page === p ? "primary.600" : "transparent"}
                                color={page === p ? "white" : "neutral.600"}
                                border="1px solid"
                                borderColor={page === p ? "primary.600" : "neutral.200"}
                                cursor="pointer"
                                _hover={{ bg: page === p ? "primary.700" : "neutral.100" }}
                                aria-current={page === p ? "page" : undefined}
                                onClick={() => onPage(p as number)}
                            >
                                {p}
                            </chakra.button>
                        )
                    )}

                    <Box w={{ base: "20", sm: "24" }} flexShrink={0}>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={onNext}
                        >
                            {t("common.next")} →
                        </Button>
                    </Box>
                </HStack>
            )}
        </Flex>
    )
}

export default TablePagination
