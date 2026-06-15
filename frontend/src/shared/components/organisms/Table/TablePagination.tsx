import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import Button from "@/shared/components/atoms/button"

interface TablePaginationProps {
    page:       number
    totalPages: number
    onPrev:     () => void
    onNext:     () => void
    onPage:     (p: number) => void
}

const TablePagination = ({
    page,
    totalPages,
    onPrev,
    onNext,
    onPage
}: TablePaginationProps) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce<(number | string)[]>((acc, p, i, arr) => {
            if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...")
            acc.push(p)
            return acc
        }, [])

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
            <Text fontSize="sm" color="neutral.500">
                Page {page} of {totalPages}
            </Text>

            <HStack gap={2} overflowX="auto" pb={{ base: 1, sm: 0 }}>
                <Box w={{ base: "20", sm: "24" }} flexShrink={0}>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === 1}
                        onClick={onPrev}
                    >
                        ← Previous
                    </Button>
                </Box>

                {pages.map((p, i) =>
                    p === "..." ? (
                        <Text key={`ellipsis-${i}`} fontSize="sm" color="neutral.400" px={1}>
                            ...
                        </Text>
                    ) : (
                        <Box
                            key={p}
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
                            onClick={() => onPage(p as number)}
                        >
                            {p}
                        </Box>
                    )
                )}

                <Box w={{ base: "20", sm: "24" }} flexShrink={0}>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={onNext}
                    >
                        Next →
                    </Button>
                </Box>
            </HStack>
        </Flex>
    )
}

export default TablePagination
