import { useState } from "react"
import { Box, chakra, Flex, HStack, Spinner, Text, VStack } from "@chakra-ui/react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { FiSearch, FiX } from "react-icons/fi"
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue"
import { useI18n } from "@/shared/i18n/useI18n"
import type { EntityId, FetchOptionsPage } from "./EntitySelect"

export interface EntityMultiSelectProps<T> {
    // Selected ids, as strings (matches react-hook-form checkbox values).
    value: string[]
    onChange: (value: string[]) => void
    queryKey: readonly unknown[]
    fetchPage: FetchOptionsPage<T>
    // Records already known to be selected (e.g. from the record being edited),
    // used to label selections that are not on a loaded page.
    knownItems?: T[] | undefined
    getId: (item: T) => EntityId
    getLabel: (item: T) => string
    getDescription?: ((item: T) => string | undefined) | undefined
    emptyLabel?: string | undefined
    disabled?: boolean
    pageSize?: number
}

/**
 * Inline multi-select backed by a paginated endpoint. Selections stay in
 * `value` regardless of which page or search is shown, and are listed as
 * chips so nothing is dropped just because it is not loaded.
 */
const EntityMultiSelect = <T,>({
    value,
    onChange,
    queryKey,
    fetchPage,
    knownItems = [],
    getId,
    getLabel,
    getDescription,
    emptyLabel,
    disabled = false,
    pageSize = 20,
}: EntityMultiSelectProps<T>) => {
    const { t } = useI18n()
    const [searchInput, setSearchInput] = useState("")
    // Labels for records picked during this session.
    const [pickedItems, setPickedItems] = useState<Map<string, T>>(new Map())
    const search = useDebouncedValue(searchInput.trim(), 300)

    const options = useInfiniteQuery({
        queryKey: [...queryKey, "options", { search, pageSize }],
        queryFn: ({ pageParam }) => fetchPage({ page: pageParam, pageSize, search: search || undefined }),
        initialPageParam: 1,
        getNextPageParam: last =>
            last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
        enabled: !disabled,
    })

    const items = options.data?.pages.flatMap(page => page.data) ?? []
    const selectedSet = new Set(value)

    const labelFor = (selectedId: string) => {
        const item =
            pickedItems.get(selectedId) ??
            knownItems.find(known => String(getId(known)) === selectedId) ??
            items.find(loaded => String(getId(loaded)) === selectedId)
        return item ? getLabel(item) : `#${selectedId}`
    }

    const toggle = (item: T) => {
        const itemId = String(getId(item))
        if (selectedSet.has(itemId)) {
            onChange(value.filter(existing => existing !== itemId))
            return
        }
        setPickedItems(previous => new Map(previous).set(itemId, item))
        onChange([...value, itemId])
    }

    const remove = (selectedId: string) => onChange(value.filter(existing => existing !== selectedId))

    return (
        <VStack align="stretch" gap={3}>
            {value.length > 0 && (
                <Box>
                    <Text fontSize="xs" color="neutral.500" mb={2}>
                        {t("common.selectedCount", { count: value.length })}
                    </Text>
                    <HStack gap={2} flexWrap="wrap">
                        {value.map(selectedId => (
                            <HStack
                                key={selectedId}
                                gap={1}
                                pl={3}
                                pr={1}
                                py={1}
                                bg="primary.50"
                                color="primary.800"
                                border="1px solid"
                                borderColor="primary.200"
                                borderRadius="full"
                                fontSize="xs"
                            >
                                <Text>{labelFor(selectedId)}</Text>
                                <chakra.button
                                    type="button"
                                    display="flex"
                                    p={1}
                                    borderRadius="full"
                                    _hover={{ bg: "primary.100" }}
                                    aria-label={`${t("common.clearSelection")} ${labelFor(selectedId)}`}
                                    disabled={disabled}
                                    onClick={() => remove(selectedId)}
                                >
                                    <FiX />
                                </chakra.button>
                            </HStack>
                        ))}
                    </HStack>
                </Box>
            )}

            <Flex
                align="center"
                gap={2}
                px={3}
                py={2}
                bg="neutral.50"
                border="1px solid"
                borderColor="neutral.200"
                borderRadius="md"
            >
                <Box color="neutral.400"><FiSearch /></Box>
                <input
                    value={searchInput}
                    placeholder={t("common.searchPlaceholder")}
                    aria-label={t("common.searchPlaceholder")}
                    disabled={disabled}
                    onChange={event => setSearchInput(event.target.value)}
                    style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", background: "transparent" }}
                />
            </Flex>

            <Box maxH="72" overflowY="auto">
                {options.isLoading ? (
                    <Flex py={6} justify="center"><Spinner size="sm" color="primary.500" /></Flex>
                ) : options.isError ? (
                    <Flex p={4} gap={3} align="center" justify="center" bg="error.50" borderRadius="md">
                        <Text fontSize="sm" color="error.600">{t("common.failedToLoad")}</Text>
                        <chakra.button type="button" fontSize="sm" color="primary.700" onClick={() => void options.refetch()}>
                            {t("common.retry")}
                        </chakra.button>
                    </Flex>
                ) : items.length === 0 ? (
                    <Box p={4} bg="neutral.50" borderRadius="md">
                        <Text fontSize="sm" color="neutral.500">
                            {search ? t("common.noResults") : emptyLabel ?? t("common.noData")}
                        </Text>
                    </Box>
                ) : (
                    <VStack align="stretch" gap={2}>
                        {items.map(item => {
                            const itemId = String(getId(item))
                            const checked = selectedSet.has(itemId)
                            const description = getDescription?.(item)
                            return (
                                <chakra.label
                                    key={itemId}
                                    display="flex"
                                    alignItems="center"
                                    gap={3}
                                    p={3}
                                    border="1px solid"
                                    borderColor={checked ? "primary.300" : "neutral.200"}
                                    bg={checked ? "primary.50" : "white"}
                                    borderRadius="md"
                                    cursor={disabled ? "not-allowed" : "pointer"}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={disabled}
                                        onChange={() => toggle(item)}
                                    />
                                    <Box minW={0}>
                                        <Text fontSize="sm" fontWeight="medium" color="neutral.800" truncate>
                                            {getLabel(item)}
                                        </Text>
                                        {description && (
                                            <Text fontSize="xs" color="neutral.500">{description}</Text>
                                        )}
                                    </Box>
                                </chakra.label>
                            )
                        })}
                    </VStack>
                )}
            </Box>

            {options.hasNextPage && (
                <chakra.button
                    type="button"
                    py={2}
                    fontSize="sm"
                    color="primary.700"
                    fontWeight="medium"
                    border="1px solid"
                    borderColor="neutral.200"
                    borderRadius="md"
                    disabled={options.isFetchingNextPage}
                    onClick={() => void options.fetchNextPage()}
                >
                    {options.isFetchingNextPage ? <Spinner size="xs" /> : t("common.loadMore")}
                </chakra.button>
            )}
        </VStack>
    )
}

export default EntityMultiSelect
