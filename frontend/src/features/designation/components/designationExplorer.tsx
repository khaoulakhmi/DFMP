import { designationApi } from "@/api/designation.api"
import { lotApi } from "@/api/lot.api"
import { productApi } from "@/api/product.api"
import Button from "@/shared/components/atoms/button"
import Badge from "@/shared/components/atoms/badge"
import Modal from "@/shared/components/molecules/modal"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import type { Product, TVA } from "@/shared/types/product.types"
import { Box, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { FiBox, FiChevronRight, FiEdit2, FiGrid, FiPlus, FiShoppingCart, FiTrash2 } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import CreateDesignationModal from "./createDesignationModal"
import EditDesignationModal from "./editDesignationModal"
import CreateLotModal from "@/features/lot/components/createLotModal"
import CreateProductModal from "@/features/product/components/createProductModal"

const tvaLabels: Record<TVA, string> = {
    ZERO: "TVA 0%",
    NINE: "TVA 9%",
    NINETEEN: "TVA 19%",
}

const truncate = (value: string, max = 18) => {
    if (value.length <= max) return value
    return `${value.slice(0, max - 1)}...`
}

const countByDesignation = <T extends { designationId: number }>(items: T[], designationId: number) =>
    items.filter(item => item.designationId === designationId).length

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

const DesignationExplorer = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isCreateLotOpen, setIsCreateLotOpen] = useState(false)
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
    const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null)
    const [deletingDesignation, setDeletingDesignation] = useState<Designation | null>(null)
    const [selectedDesignationId, setSelectedDesignationId] = useState<number | null>(null)
    const [selectedLotId, setSelectedLotId] = useState<number | null>(null)

    const {
        data: designations = [] as Designation[],
        isLoading: isLoadingDesignations,
        isError: isDesignationError,
    } = useQuery<Designation[]>({
        queryKey: ["designations"],
        queryFn: designationApi.getAll,
    })

    const {
        data: lots = [] as Lot[],
        isLoading: isLoadingLots,
        isError: isLotError,
    } = useQuery<Lot[]>({
        queryKey: ["lots"],
        queryFn: lotApi.getAll,
    })

    const {
        data: products = [] as Product[],
        isLoading: isLoadingProducts,
        isError: isProductError,
    } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: productApi.getAll,
    })

    const selectedDesignation = designations.find(designation => designation.id === selectedDesignationId) ?? null

    const designationLots = useMemo(
        () => lots.filter(lot => lot.designationId === selectedDesignationId),
        [lots, selectedDesignationId],
    )

    const selectedLot = designationLots.find(lot => lot.id === selectedLotId) ?? null

    const lotProducts = useMemo(
        () => products.filter(product => product.lotId === selectedLotId),
        [products, selectedLotId],
    )

    useEffect(() => {
        if (selectedDesignationId !== null || designations.length === 0) return
        setSelectedDesignationId(designations[0]?.id ?? null)
    }, [designations, selectedDesignationId])

    useEffect(() => {
        if (designationLots.some(lot => lot.id === selectedLotId)) return
        setSelectedLotId(designationLots[0]?.id ?? null)
    }, [designationLots, selectedLotId])

    const isLoading = isLoadingDesignations || isLoadingLots || isLoadingProducts
    const isError = isDesignationError || isLotError || isProductError

    const deleteMutation = useMutation({
        mutationFn: (designation: Designation) => designationApi.delete(String(designation.id)),
        onSuccess: (_, designation) => {
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            toaster.create({
                title: "Designation deleted",
                description: `${designation.name} has been deleted.`,
                type: "success",
            })

            if (selectedDesignationId === designation.id) {
                const nextDesignation = designations.find(item => item.id !== designation.id)
                setSelectedDesignationId(nextDesignation?.id ?? null)
                setSelectedLotId(null)
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

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="64" bg="white" borderRadius="xl" border="1px solid" borderColor="neutral.200">
                <VStack gap={3}>
                    <Spinner color="primary.500" />
                    <Text fontSize="sm" color="neutral.500">Loading designation explorer...</Text>
                </VStack>
            </Flex>
        )
    }

    if (isError) {
        return (
            <Box p={6} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl">
                <Text color="error.600" fontSize="sm" fontWeight="medium">
                    Failed to load designations, lots, or products.
                </Text>
            </Box>
        )
    }

    return (
        <Box>
            <CreateDesignationModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <CreateLotModal
                open={isCreateLotOpen}
                onClose={() => setIsCreateLotOpen(false)}
                designations={designations}
                defaultDesignationId={selectedDesignationId}
            />
            <CreateProductModal
                open={isCreateProductOpen}
                onClose={() => setIsCreateProductOpen(false)}
                designations={designations}
                lots={lots}
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
                        title="Designations"
                        actionLabel="Add designation"
                        onAdd={() => setIsCreateModalOpen(true)}
                    />

                    {designations.length === 0 ? (
                        <EmptyState label="No designations available." />
                    ) : (
                        <VStack align="stretch" gap={0}>
                            {designations.map(designation => {
                                const isSelected = designation.id === selectedDesignationId
                                const lotsCount = countByDesignation(lots, designation.id)
                                const productsCount = countByDesignation(products, designation.id)

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
                                            setSelectedDesignationId(designation.id)
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
                                                {lotsCount} lot{lotsCount === 1 ? "" : "s"} - {productsCount} product{productsCount === 1 ? "" : "s"}
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
                </ExplorerCard>

                <ExplorerCard>
                    <ColumnHeader
                        icon={<FiBox />}
                        title={selectedDesignation ? `Lots - ${selectedDesignation.name}` : "Lots"}
                        actionLabel="Add lot"
                        onAdd={() => setIsCreateLotOpen(true)}
                    />

                    {!selectedDesignation ? (
                        <EmptyState label="Select a designation to see lots." />
                    ) : designationLots.length === 0 ? (
                        <EmptyState label="No lots for this designation." />
                    ) : (
                        <VStack align="stretch" gap={0}>
                            {designationLots.map(lot => {
                                const isSelected = lot.id === selectedLotId
                                const productsCount = products.filter(product => product.lotId === lot.id).length
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
                                        onClick={() => setSelectedLotId(lot.id)}
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
                                                {productsCount} product{productsCount === 1 ? "" : "s"}
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
                </ExplorerCard>

                <ExplorerCard>
                    <ColumnHeader
                        icon={<FiShoppingCart />}
                        title={selectedLot ? `Products - ${selectedLot.name}` : "Products"}
                        actionLabel="Add product"
                        onAdd={() => setIsCreateProductOpen(true)}
                    />

                    {!selectedLot ? (
                        <EmptyState label="Select a lot to see products." />
                    ) : lotProducts.length === 0 ? (
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
                </ExplorerCard>
            </SimpleGrid>
        </Box>
    )
}

export default DesignationExplorer
