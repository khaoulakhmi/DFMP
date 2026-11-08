import { useEffect, useId, useRef, useState } from "react"
import { Box, chakra, Flex, Spinner, Text, VStack } from "@chakra-ui/react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { FaChevronDown } from "react-icons/fa"
import { FiSearch, FiX } from "react-icons/fi"
import FormField from "./formfield"
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue"
import { useI18n } from "@/shared/i18n/useI18n"
import type { PaginatedResponse } from "@/shared/types/pagination.types"

export type EntityId = string | number

export type FetchOptionsPage<T> = (args: {
    page: number
    pageSize: number
    search: string | undefined
}) => Promise<PaginatedResponse<T>>

export interface EntitySelectProps<T> {
    label?: string | undefined
    helper?: string | undefined
    error?: string | undefined
    required?: boolean
    showRequiredIndicator?: boolean
    placeholder?: string | undefined
    disabled?: boolean
    clearable?: boolean
    // Currently selected id; "" / null / undefined means nothing selected.
    value: EntityId | null | undefined
    onChange: (item: T | null) => void
    onBlur?: (() => void) | undefined
    // Base key for the options query. Include any filters it depends on.
    queryKey: readonly unknown[]
    fetchPage: FetchOptionsPage<T>
    // Loads the selected record when it is not on a loaded page.
    fetchById?: ((id: EntityId) => Promise<T>) | undefined
    byIdQueryKey?: ((id: EntityId) => readonly unknown[]) | undefined
    // The selected record, when the caller already has it (e.g. from a detail).
    selectedItem?: T | null | undefined
    getId: (item: T) => EntityId
    getLabel: (item: T) => string
    getDescription?: ((item: T) => string | undefined) | undefined
    pageSize?: number
}

const hasValue = (value: EntityId | null | undefined): value is EntityId =>
    value !== null && value !== undefined && value !== ""

/**
 * Searchable select backed by a paginated endpoint. Options are fetched with
 * server-side search and "load more", so records beyond the first page can be
 * found. The selected record keeps its label even when it is not in the
 * loaded options.
 */
const EntitySelect = <T,>({
    label,
    helper,
    error,
    required = false,
    showRequiredIndicator = false,
    placeholder,
    disabled = false,
    clearable = false,
    value,
    onChange,
    onBlur,
    queryKey,
    fetchPage,
    fetchById,
    byIdQueryKey,
    selectedItem,
    getId,
    getLabel,
    getDescription,
    pageSize = 20,
}: EntitySelectProps<T>) => {
    const { t } = useI18n()
    const id = useId()
    const listId = `${id}-list`
    const rootRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [searchInput, setSearchInput] = useState("")
    const [picked, setPicked] = useState<T | null>(null)
    const search = useDebouncedValue(searchInput.trim(), 300)

    const options = useInfiniteQuery({
        queryKey: [...queryKey, "options", { search, pageSize }],
        queryFn: ({ pageParam }) => fetchPage({ page: pageParam, pageSize, search: search || undefined }),
        initialPageParam: 1,
        getNextPageParam: last =>
            last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
        enabled: open && !disabled,
    })

    const items = options.data?.pages.flatMap(page => page.data) ?? []
    const isSelected = (item: T) => hasValue(value) && String(getId(item)) === String(value)

    const knownSelected =
        (picked && isSelected(picked) ? picked : null) ??
        (selectedItem && isSelected(selectedItem) ? selectedItem : null) ??
        items.find(isSelected) ??
        null

    // Last resort: fetch the selected record by id so it is never shown blank.
    const selectedById = useQuery({
        queryKey: hasValue(value) && byIdQueryKey ? byIdQueryKey(value) : [...queryKey, "by-id", value],
        queryFn: () => (fetchById && hasValue(value) ? fetchById(value) : Promise.reject(new Error("No id"))),
        enabled: hasValue(value) && !knownSelected && Boolean(fetchById),
    })

    const selected = knownSelected ?? (selectedById.data && isSelected(selectedById.data) ? selectedById.data : null)

    const close = () => {
        setOpen(false)
        setSearchInput("")
        onBlur?.()
    }

    // Close when clicking outside.
    useEffect(() => {
        if (!open) return
        const handlePointerDown = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false)
                setSearchInput("")
                onBlur?.()
            }
        }
        document.addEventListener("mousedown", handlePointerDown)
        return () => document.removeEventListener("mousedown", handlePointerDown)
    }, [open, onBlur])

    const choose = (item: T | null) => {
        setPicked(item)
        onChange(item)
        close()
    }

    const displayLabel = selected
        ? getLabel(selected)
        : hasValue(value)
            ? (selectedById.isLoading ? t("common.loadingData") : `#${value}`)
            : placeholder ?? t("common.selectPlaceholder")

    return (
        <FormField
            label={label}
            required={required}
            showRequiredIndicator={showRequiredIndicator}
            labelFor={id}
            {...(helper !== undefined && { helper })}
            {...(error !== undefined && { error })}
        >
            <Box ref={rootRef} position="relative">
                <chakra.button
                    id={id}
                    type="button"
                    display="flex"
                    w="full"
                    minH="10"
                    px={3}
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                    bg={disabled ? "neutral.50" : "white"}
                    border="1px solid"
                    borderColor={error ? "error.500" : open ? "primary.500" : "neutral.300"}
                    borderRadius="md"
                    cursor={disabled ? "not-allowed" : "pointer"}
                    textAlign="start"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-invalid={Boolean(error) || undefined}
                    disabled={disabled}
                    onClick={() => (open ? close() : setOpen(true))}
                    onKeyDown={event => {
                        if (event.key === "Escape" && open) close()
                    }}
                >
                    <Text
                        fontSize="sm"
                        color={selected || hasValue(value) ? "neutral.900" : "neutral.500"}
                        truncate
                    >
                        {displayLabel}
                    </Text>
                    <Flex align="center" gap={2} color="neutral.500" flexShrink={0}>
                        {clearable && hasValue(value) && !disabled && (
                            <Box
                                as="span"
                                role="button"
                                tabIndex={0}
                                aria-label={t("common.clearSelection")}
                                onClick={event => {
                                    event.stopPropagation()
                                    choose(null)
                                }}
                                onKeyDown={event => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        choose(null)
                                    }
                                }}
                            >
                                <FiX />
                            </Box>
                        )}
                        <FaChevronDown size={14} />
                    </Flex>
                </chakra.button>

                {open && (
                    <Box
                        position="absolute"
                        zIndex={20}
                        top="calc(100% + 4px)"
                        insetX={0}
                        bg="white"
                        border="1px solid"
                        borderColor="neutral.200"
                        borderRadius="md"
                        boxShadow="lg"
                        overflow="hidden"
                    >
                        <Flex align="center" gap={2} px={3} py={2} borderBottom="1px solid" borderColor="neutral.100">
                            <Box color="neutral.400"><FiSearch /></Box>
                            <input
                                autoFocus
                                value={searchInput}
                                placeholder={t("common.searchPlaceholder")}
                                aria-label={t("common.searchPlaceholder")}
                                aria-controls={listId}
                                onChange={event => setSearchInput(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === "Escape") close()
                                }}
                                style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", background: "transparent" }}
                            />
                        </Flex>

                        <VStack id={listId} role="listbox" align="stretch" gap={0} maxH="64" overflowY="auto">
                            {options.isLoading ? (
                                <Flex py={6} justify="center"><Spinner size="sm" color="primary.500" /></Flex>
                            ) : options.isError ? (
                                <Flex py={4} px={3} direction="column" align="center" gap={2}>
                                    <Text fontSize="sm" color="error.600">{t("common.failedToLoad")}</Text>
                                    <chakra.button
                                        type="button"
                                        fontSize="sm"
                                        color="primary.700"
                                        fontWeight="medium"
                                        onClick={() => void options.refetch()}
                                    >
                                        {t("common.retry")}
                                    </chakra.button>
                                </Flex>
                            ) : items.length === 0 ? (
                                <Text py={4} px={3} fontSize="sm" color="neutral.500" textAlign="center">
                                    {search ? t("common.noResults") : t("common.noData")}
                                </Text>
                            ) : (
                                items.map(item => {
                                    const active = isSelected(item)
                                    const description = getDescription?.(item)
                                    return (
                                        <chakra.button
                                            key={String(getId(item))}
                                            type="button"
                                            role="option"
                                            aria-selected={active}
                                            textAlign="start"
                                            px={3}
                                            py={2}
                                            bg={active ? "primary.50" : "white"}
                                            _hover={{ bg: active ? "primary.50" : "neutral.50" }}
                                            onClick={() => choose(item)}
                                        >
                                            <Text fontSize="sm" fontWeight={active ? "semibold" : "normal"} color="neutral.900" truncate>
                                                {getLabel(item)}
                                            </Text>
                                            {description && (
                                                <Text fontSize="xs" color="neutral.500" truncate>{description}</Text>
                                            )}
                                        </chakra.button>
                                    )
                                })
                            )}

                            {options.hasNextPage && (
                                <chakra.button
                                    type="button"
                                    py={2}
                                    fontSize="sm"
                                    color="primary.700"
                                    fontWeight="medium"
                                    borderTop="1px solid"
                                    borderColor="neutral.100"
                                    disabled={options.isFetchingNextPage}
                                    onClick={() => void options.fetchNextPage()}
                                >
                                    {options.isFetchingNextPage ? <Spinner size="xs" /> : t("common.loadMore")}
                                </chakra.button>
                            )}
                        </VStack>
                    </Box>
                )}
            </Box>
        </FormField>
    )
}

export default EntitySelect
