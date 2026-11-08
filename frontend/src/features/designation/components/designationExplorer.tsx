import { designationApi } from "@/api/designation.api"
import { lotApi } from "@/api/lot.api"
import { productApi } from "@/api/product.api"
import Button from "@/shared/components/atoms/button"
import Badge from "@/shared/components/atoms/badge"
import Modal from "@/shared/components/molecules/modal"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue"
import { useI18n } from "@/shared/i18n/useI18n"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import type { PaginatedResponse } from "@/shared/types/pagination.types"
import type { TVA } from "@/shared/types/product.types"
import { Box, chakra, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query"
import { useState } from "react"
import { FiBox, FiChevronRight, FiEdit2, FiGrid, FiPlus, FiSearch, FiShoppingCart, FiTrash2 } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import CreateDesignationModal from "./createDesignationModal"
import EditDesignationModal from "./editDesignationModal"
import CreateLotModal from "@/features/lot/components/createLotModal"
import CreateProductModal from "@/features/product/components/createProductModal"

const PAGE_SIZE = 20

const tvaLabels: Record<TVA, string> = {
    ZERO: "TVA 0%",
    NINE: "TVA 9%",
    NINETEEN: "TVA 19%",
}

const truncate = (value: string, max = 18) => {
    if (value.length <= max) return value
    return `${value.slice(0, max - 1)}...`
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`

const nextPage = <T,>(last: PaginatedResponse<T>) =>
    last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined

const flatten = <T,>(data: InfiniteData<PaginatedResponse<T>> | undefined) =>
    data?.pages.flatMap(page => page.data) ?? []

const ExplorerCard = ({ children }: { children: React.ReactNode }) => (
    <Box
        bg="white"
        border="1px solid"
        borderColor="neutral.200"
        borderRadius="lg"
        overflow="hidden"
        minH={{ base: "auto", lg: "96" }}
        boxShadow="sm"
    >
        {children}
    </Box>
)

const ColumnHeader = ({
    icon,
    title,
    actionLabel,
    onAdd,
}: {
    icon: React.ReactElement
    title: string
    actionLabel: string
    onAdd?: () => void
}) => (
    <Flex
        align="center"
        justify="space-between"
        gap={3}
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor="neutral.200"
        minH="16"
    >
        <HStack gap={2} minW="0">
            <Box color="neutral.600" flexShrink={0}>{icon}</Box>
            <Text
                fontSize="sm"
                fontWeight="bold"
                color="neutral.700"
                textTransform="uppercase"
                letterSpacing="0"
                lineHeight="1.2"
            >
                {title}
            </Text>
        </HStack>
        {onAdd && (
            <Box w="12" flexShrink={0}>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    aria-label={actionLabel}
                    title={actionLabel}
                    onClick={onAdd}
                >
                    <FiPlus />
                </Button>
            </Box>
        )}
    </Flex>
)

const EmptyState = ({ label }: { label: string }) => (
    <Flex h="56" align="center" justify="center" px={5} textAlign="center">
        <Text fontSize="sm" color="neutral.400">{label}</Text>
    </Flex>
)

// Loading / error / "load more" states shared by the three columns.
const ColumnStatus = ({
    isLoading,
    isError,
    onRetry,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
}: {
    isLoading: boolean
    isError: boolean
    onRetry: () => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
    onLoadMore: () => void
}) => {
    const { t } = useI18n()

    if (isLoading) {
        return <Flex h="40" align="center" justify="center"><Spinner color="primary.500" size="sm" /></Flex>
    }

    if (isError) {
        return (
            <Flex py={6} direction="column" align="center" gap={2}>
                <Text fontSize="sm" color="error.600">{t("common.failedToLoad")}</Text>
                <chakra.button type="button" fontSize="sm" color="primary.700" fontWeight="medium" onClick={onRetry}>
                    {t("common.retry")}
                </chakra.button>
            </Flex>
        )
    }

    if (!hasNextPage) return null

    return (
        <chakra.button
            type="button"
            w="full"
            py={3}
            fontSize="sm"
            color="primary.700"
            fontWeight="medium"
            disabled={isFetchingNextPage}
            onClick={onLoadMore}
        >
            {isFetchingNextPage ? <Spinner size="xs" /> : t("common.loadMore")}
        </chakra.button>
    )
}

const DesignationExplorer = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { t } = useI18n()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isCreateLotOpen, setIsCreateLotOpen] = useState(false)
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
    const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null)
    const [deletingDesignation, setDeletingDesignation] = useState<Designation | null>(null)
    const [pickedDesignation, setPickedDesignation] = useState<Designation | null>(null)
    const [pickedLot, setPickedLot] = useState<Lot | null>(null)
    const [designationSearch, setDesignationSearch] = useState("")
    const search = useDebouncedValue(designationSearch.trim(), 300)

    const designationsQuery = useInfiniteQuery({
        queryKey: ["designations", "explorer", { search }],
        queryFn: ({ pageParam }) => designationApi.list({
            page: pageParam,
            pageSize: PAGE_SIZE,
            search: search || undefined,
            sortBy: "name",
            sortOrder: "asc",
        }),
        initialPageParam: 1,
        getNextPageParam: nextPage,
    })
    const designations = flatten(designationsQuery.data)

    // Use the fresh copy when loaded (e.g. after a rename); default to the first one.
    const selectedDesignation =
        (pickedDesignation && (designations.find(item => item.id === pickedDesignation.id) ?? pickedDesignation)) ??
        designations[0] ??
        null
    const selectedDesignationId = selectedDesignation?.id ?? null

    const lotsQuery = useInfiniteQuery({
        queryKey: ["lots", "by-designation", selectedDesignationId, "explorer"],
        queryFn: ({ pageParam }) => lotApi.list({
            page: pageParam,
            pageSize: PAGE_SIZE,
            designationId: selectedDesignationId ?? undefined,
            sortBy: "name",
            sortOrder: "asc",
        }),
        initialPageParam: 1,
        getNextPageParam: nextPage,
        enabled: selectedDesignationId !== null,
    })
    const designationLots = flatten(lotsQuery.data)

    const selectedLot =
        (pickedLot && pickedLot.designationId === selectedDesignationId
            ? designationLots.find(item => item.id === pickedLot.id) ?? pickedLot
            : null) ??
        designationLots[0] ??
        null
    const selectedLotId = selectedLot?.id ?? null

    const productsQuery = useInfiniteQuery({
        queryKey: ["products", "by-lot", selectedLotId],
        queryFn: ({ pageParam }) => productApi.list({
            page: pageParam,
            pageSize: PAGE_SIZE,
            lotId: selectedLotId ?? undefined,
            sortBy: "name",
            sortOrder: "asc",
        }),
        initialPageParam: 1,
        getNextPageParam: nextPage,
        enabled: selectedLotId !== null,
    })
    const lotProducts = flatten(productsQuery.data)

    const designationTotal = designationsQuery.data?.pages[0]?.pagination.total
    const lotTotal = lotsQuery.data?.pages[0]?.pagination.total
    const productTotal = productsQuery.data?.pages[0]?.pagination.total

    const deleteMutation = useMutation({
        mutationFn: (designation: Designation) => designationApi.delete(designation.id),
        onSuccess: (_, designation) => {
            void queryClient.invalidateQueries({ queryKey: ["designations"] })
            toaster.create({
                title: "Designation deleted",
                description: `${designation.name} has been deleted.`,
                type: "success",
            })

            if (selectedDesignationId === designation.id) {
                setPickedDesignation(null)
                setPickedLot(null)
            }

            setDeletingDesignation(null)
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to delete designation. Please try again.",
                type: "error",
            })
        },
    })

    return (
        <Box>
            <CreateDesignationModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <CreateLotModal
                open={isCreateLotOpen}
                onClose={() => setIsCreateLotOpen(false)}
                defaultDesignationId={selectedDesignationId}
            />
            <CreateProductModal
                open={isCreateProductOpen}
                onClose={() => setIsCreateProductOpen(false)}
                defaultDesignationId={selectedDesignationId}
                defaultLotId={selectedLotId}
            />
            <EditDesignationModal
                open={Boolean(editingDesignation)}
                designation={editingDesignation}
                onClose={() => setEditingDesignation(null)}
            />
            <Modal
                open={Boolean(deletingDesignation)}
                onClose={() => {
                    if (!deleteMutation.isPending) setDeletingDesignation(null)
                }}
                title="Delete Designation"
                description="This action cannot be undone."
                confirmLabel="Delete"
                confirmVariant="danger"
                isConfirmLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingDesignation) deleteMutation.mutate(deletingDesignation)
                }}
            >
                <Text fontSize="sm" color="neutral.700">
                    Delete {deletingDesignation?.name}? Related lots and products may be affected depending on backend rules.
                </Text>
            </Modal>

            <Box mb={4}>
                <Text fontSize="lg" fontWeight="semibold" color="neutral.900">
                    Designation Explorer
                </Text>
                <Text fontSize="sm" color="neutral.500">
                    Click a designation or lot to drill down.
                </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={4} alignItems="stretch">
                <ExplorerCard>
                    <ColumnHeader
                        icon={<FiGrid />}
                        title={designationTotal !== undefined ? `Designations (${designationTotal})` : "Designations"}
                        actionLabel="Add designation"
                        onAdd={() => setIsCreateModalOpen(true)}
                    />

                    <Flex align="center" gap={2} px={4} py={2} borderBottom="1px solid" borderColor="neutral.100">
                        <Box color="neutral.400"><FiSearch /></Box>
                        <input
                            value={designationSearch}
                            placeholder={t("common.searchPlaceholder")}
                            aria-label={t("common.searchPlaceholder")}
                            onChange={event => setDesignationSearch(event.target.value)}
                            style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", background: "transparent" }}
                        />
                    </Flex>

                    {designations.length === 0 && !designationsQuery.isLoading && !designationsQuery.isError ? (
                        <EmptyState label={search ? t("common.noResults") : "No designations available."} />
                    ) : (
                        <VStack align="stretch" gap={0}>
                            {designations.map(designation => {
                                const isSelected = designation.id === selectedDesignationId
                                const lotsCount = designation._count?.lots ?? 0
                                const productsCount = designation._count?.products ?? 0

                                return (
                                    <Flex
                                        key={designation.id}
                                        align="center"
                                        gap={3}
                                        px={4}
                                        py={3}
                                        minH="16"
                                        cursor="pointer"
                                        bg={isSelected ? "primary.100" : "white"}
                                        borderBottom="1px solid"
                                        borderColor="neutral.200"
                                        _hover={{ bg: isSelected ? "primary.100" : "neutral.50" }}
                                        onClick={() => {
                                            setPickedDesignation(designation)
                                            setPickedLot(null)
                                        }}
                                    >
                                        <Flex
                                            w="8"
                                            h="8"
                                            align="center"
                                            justify="center"
                                            borderRadius="md"
                                            bg={isSelected ? "primary.50" : "accent.50"}
                                            color={isSelected ? "primary.700" : "accent.700"}
                                            flexShrink={0}
                                        >
                                            <FiGrid />
                                        </Flex>

                                        <Box minW="0" flex="1">
                                            <Text fontSize="sm" fontWeight="semibold" color="neutral.900" truncate>
                                                {designation.name}
                                            </Text>
                                            <Text fontSize="xs" color="neutral.600">
                                                {plural(lotsCount, "lot")} - {plural(productsCount, "product")}
                                            </Text>
                                        </Box>

                                        <HStack gap={1} flexShrink={0}>
                                            <Box w="8">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    aria-label={`Edit ${designation.name}`}
                                                    title={`Edit ${designation.name}`}
                                                    onClick={(event) => {
                                                        event.stopPropagation()
                                                        setEditingDesignation(designation)
                                                    }}
                                                >
                                                    <FiEdit2 />
                                                </Button>
                                            </Box>
                                            <Box w="8">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    aria-label={`Delete ${designation.name}`}
                                                    title={`Delete ${designation.name}`}
                                                    onClick={(event) => {
                                                        event.stopPropagation()
                                                        setDeletingDesignation(designation)
                                                    }}
                                                >
                                                    <Box color="error.600">
                                                        <FiTrash2 />
                                                    </Box>
                                                </Button>
                                            </Box>
                                            <Box color="neutral.500">
                                                <FiChevronRight />
                                            </Box>
                                        </HStack>
                                    </Flex>
                                )
                            })}
                        </VStack>
                    )}
                    <ColumnStatus
                        isLoading={designationsQuery.isLoading}
                        isError={designationsQuery.isError}
                        onRetry={() => void designationsQuery.refetch()}
                        hasNextPage={designationsQuery.hasNextPage}
                        isFetchingNextPage={designationsQuery.isFetchingNextPage}
                        onLoadMore={() => void designationsQuery.fetchNextPage()}
                    />
                </ExplorerCard>

                <ExplorerCard>
                    <ColumnHeader
                        icon={<FiBox />}
                        title={selectedDesignation
                            ? `Lots - ${selectedDesignation.name}${lotTotal !== undefined ? ` (${lotTotal})` : ""}`
                            : "Lots"}
                        actionLabel="Add lot"
                        onAdd={() => setIsCreateLotOpen(true)}
                    />

                    {!selectedDesignation ? (
                        <EmptyState label="Select a designation to see lots." />
                    ) : designationLots.length === 0 && !lotsQuery.isLoading && !lotsQuery.isError ? (
                        <EmptyState label="No lots for this designation." />
                    ) : (
                        <VStack align="stretch" gap={0}>
                            {designationLots.map(lot => {
                                const isSelected = lot.id === selectedLotId
                                const productsCount = lot._count?.products ?? 0
                                const status = lot.specificationsId ? "Active" : "No spec"

                                return (
                                    <Flex
                                        key={lot.id}
                                        align="center"
                                        gap={3}
                                        px={4}
                                        py={3}
                                        minH="18"
                                        cursor="pointer"
                                        bg={isSelected ? "primary.100" : "white"}
                                        borderBottom="1px solid"
                                        borderColor="neutral.200"
                                        _hover={{ bg: isSelected ? "primary.100" : "neutral.50" }}
                                        onClick={() => setPickedLot(lot)}
                                    >
                                        <Flex
                                            w="8"
                                            h="8"
                                            align="center"
                                            justify="center"
                                            borderRadius="md"
                                            bg="primary.50"
                                            color="primary.700"
                                            flexShrink={0}
                                        >
                                            <FiBox />
                                        </Flex>

                                        <Box minW="0" flex="1">
                                            <Text fontSize="sm" fontWeight="semibold" color="neutral.900" truncate>
                                                {truncate(lot.name, 22)}
                                            </Text>
                                            <Text fontSize="xs" color="neutral.600">
                                                {plural(productsCount, "product")}
                                            </Text>
                                        </Box>

                                        <Badge
                                            label={status}
                                            variant={lot.specificationsId ? "success" : "neutral"}
                                            tone="subtle"
                                            size="sm"
                                        />
                                    </Flex>
                                )
                            })}
                        </VStack>
                    )}
                    {selectedDesignation && (
                        <ColumnStatus
                            isLoading={lotsQuery.isLoading}
                            isError={lotsQuery.isError}
                            onRetry={() => void lotsQuery.refetch()}
                            hasNextPage={lotsQuery.hasNextPage}
                            isFetchingNextPage={lotsQuery.isFetchingNextPage}
                            onLoadMore={() => void lotsQuery.fetchNextPage()}
                        />
                    )}
                </ExplorerCard>

                <ExplorerCard>
                    <ColumnHeader
                        icon={<FiShoppingCart />}
                        title={selectedLot
                            ? `Products - ${selectedLot.name}${productTotal !== undefined ? ` (${productTotal})` : ""}`
                            : "Products"}
                        actionLabel="Add product"
                        onAdd={() => setIsCreateProductOpen(true)}
                    />

                    {!selectedLot ? (
                        <EmptyState label="Select a lot to see products." />
                    ) : lotProducts.length === 0 && !productsQuery.isLoading && !productsQuery.isError ? (
                        <EmptyState label="No products for this lot." />
                    ) : (
                        <VStack align="stretch" gap={0}>
                            {lotProducts.map(product => (
                                <Flex
                                    key={product.id}
                                    align="flex-start"
                                    gap={3}
                                    px={4}
                                    py={3}
                                    minH="20"
                                    cursor="pointer"
                                    borderBottom="1px solid"
                                    borderColor="neutral.200"
                                    _hover={{ bg: "neutral.50" }}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                >
                                    <Flex
                                        w="8"
                                        h="8"
                                        align="center"
                                        justify="center"
                                        borderRadius="md"
                                        bg="success.50"
                                        color="success.700"
                                        flexShrink={0}
                                    >
                                        <FiShoppingCart />
                                    </Flex>

                                    <Box minW="0" flex="1">
                                        <HStack gap={2} align="center" wrap="wrap">
                                            <Text fontSize="sm" fontWeight="semibold" color="neutral.900">
                                                {product.name}
                                            </Text>
                                            <Badge
                                                label={tvaLabels[product.tva]}
                                                variant="neutral"
                                                tone="subtle"
                                                size="sm"
                                            />
                                        </HStack>
                                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={1} mt={1}>
                                            <Text fontSize="xs" color="neutral.700">
                                                Unit: {product.unit}
                                            </Text>
                                            <Text fontSize="xs" color="neutral.700">
                                                Price: {product.unitPrice} DA
                                            </Text>
                                            <Text fontSize="xs" color="neutral.700">
                                                Qte: {product.quantityMin} - {product.quantityMax}
                                            </Text>
                                        </SimpleGrid>
                                    </Box>
                                </Flex>
                            ))}
                        </VStack>
                    )}
                    {selectedLot && (
                        <ColumnStatus
                            isLoading={productsQuery.isLoading}
                            isError={productsQuery.isError}
                            onRetry={() => void productsQuery.refetch()}
                            hasNextPage={productsQuery.hasNextPage}
                            isFetchingNextPage={productsQuery.isFetchingNextPage}
                            onLoadMore={() => void productsQuery.fetchNextPage()}
                        />
                    )}
                </ExplorerCard>
            </SimpleGrid>
        </Box>
    )
}

export default DesignationExplorer
