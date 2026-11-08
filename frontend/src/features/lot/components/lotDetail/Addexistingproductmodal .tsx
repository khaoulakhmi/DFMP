import { productApi } from "@/api/product.api"
import Badge from "@/shared/components/atoms/badge"
import Button from "@/shared/components/atoms/button"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue"
import { useI18n } from "@/shared/i18n/useI18n"
import type { Product } from "@/shared/types/product.types"
import {
    Box,
    chakra,
    Dialog,
    Flex,
    HStack,
    Input,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { FiPackage, FiSearch, FiX } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { formatMoney, tvaLabels } from "./lot-detail.types"

type Props = {
    open: boolean
    onClose: () => void
    lotId: number
}

const PAGE_SIZE = 20

const AddExistingProductModal = ({ open, onClose, lotId }: Props) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { t } = useI18n()
    const [search, setSearch] = useState("")
    // Kept across searches and pages, so picks are never lost.
    const [selected, setSelected] = useState<Map<number, Product>>(new Map())
    const debouncedSearch = useDebouncedValue(search.trim(), 300)

    // Products not already in this lot, searched on the server.
    const productsQuery = useInfiniteQuery({
        queryKey: ["products", "not-in-lot", lotId, { search: debouncedSearch }],
        queryFn: ({ pageParam }) => productApi.list({
            page: pageParam,
            pageSize: PAGE_SIZE,
            notInLotId: lotId,
            search: debouncedSearch || undefined,
            sortBy: "name",
            sortOrder: "asc",
        }),
        initialPageParam: 1,
        getNextPageParam: last =>
            last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
        enabled: open,
    })

    const available = productsQuery.data?.pages.flatMap(page => page.data) ?? []
    const total = productsQuery.data?.pages[0]?.pagination.total ?? 0

    const handleClose = () => {
        setSearch("")
        setSelected(new Map())
        onClose()
    }

    const assignMutation = useMutation({
        mutationFn: async (productIds: number[]) => {
            const results = await Promise.allSettled(
                productIds.map(productId =>
                    productApi.update(productId, { lotId })
                )
            )

            const failedIds = productIds.filter(
                (_, index) => results[index]?.status === "rejected"
            )

            return {
                succeeded: productIds.length - failedIds.length,
                failedIds,
            }
        },

        onSuccess: ({ succeeded, failedIds }) => {
            if (failedIds.length === 0) {
                toaster.create({
                    title: "Products assigned",
                    description: `${succeeded} product(s) assigned.`,
                    type: "success",
                })

                handleClose()
                return
            }

            // Keep only failed products selected so the user can retry them.
            setSelected(previous => {
                const next = new Map<number, Product>()

                for (const id of failedIds) {
                    const product = previous.get(id)

                    if (product) {
                        next.set(id, product)
                    }
                }

                return next
            })

            toaster.create({
                title: "Some products could not be assigned",
                description:
                    `${succeeded} assigned, ${failedIds.length} failed. ` +
                    "The failed products remain selected for retry.",
                type: "warning",
            })
        },

        onError: () => {
            toaster.create({
                title: "Assignment failed",
                description: "An unexpected error occurred. Please try again.",
                type: "error",
            })
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["lots"] }),
                queryClient.invalidateQueries({ queryKey: ["products"] }),
                queryClient.invalidateQueries({ queryKey: ["designations"] }),
                queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
            ])
        },
    })

    const toggleProduct = (product: Product) => {
        setSelected(previous => {
            const next = new Map(previous)
            if (next.has(product.id)) next.delete(product.id)
            else next.set(product.id, product)
            return next
        })
    }

    const handleConfirm = () => {
        if (selected.size === 0) return
        assignMutation.mutate([...selected.keys()])
    }

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => !open && handleClose()} size="md">
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content borderRadius="xl" overflow="hidden">

                    {/* Header */}
                    <Flex
                        align="center" justify="space-between"
                        px={5} py={4}
                        borderBottom="1px solid" borderColor="neutral.200"
                    >
                        <Box>
                            <Text fontWeight="bold" fontSize="md" color="neutral.900">
                                Ajouter un produit existant
                            </Text>
                            <Text fontSize="xs" color="neutral.600" mt={0.5}>
                                Selectionnez un ou plusieurs produits a affecter a ce lot
                            </Text>
                        </Box>
                        <Button type="button" variant="ghost" size="sm" onClick={handleClose} aria-label="Fermer">
                            <FiX />
                        </Button>
                    </Flex>

                    {/* Search */}
                    <Box px={5} pt={4} pb={2}>
                        <Flex
                            align="center" gap={2}
                            bg="neutral.50" border="1px solid" borderColor="neutral.200"
                            borderRadius="lg" px={3} py={2}
                        >
                            <Box color="neutral.400" fontSize="sm" flexShrink={0}><FiSearch /></Box>
                            <Input
                                placeholder="Rechercher un produit..."
                                fontSize="sm"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                autoFocus
                            />
                        </Flex>
                    </Box>

                    {/* List */}
                    <Box px={5} pb={2} minH="64" maxH="72" overflowY="auto">
                        {productsQuery.isLoading ? (
                            <Flex h="40" align="center" justify="center">
                                <Spinner color="primary.500" size="sm" />
                            </Flex>
                        ) : productsQuery.isError ? (
                            <Flex h="40" align="center" justify="center" direction="column" gap={2}>
                                <Text fontSize="sm" color="error.600">{t("common.failedToLoad")}</Text>
                                <chakra.button type="button" fontSize="sm" color="primary.700" onClick={() => void productsQuery.refetch()}>
                                    {t("common.retry")}
                                </chakra.button>
                            </Flex>
                        ) : available.length === 0 ? (
                            <Flex h="40" align="center" justify="center" direction="column" gap={2}>
                                <Box color="neutral.400" fontSize="2xl"><FiPackage /></Box>
                                <Text fontSize="sm" color="neutral.500">
                                    {debouncedSearch ? "Aucun produit trouvé" : "Tous les produits sont déjà dans ce lot"}
                                </Text>
                            </Flex>
                        ) : (
                            <VStack align="stretch" gap={2} py={2}>
                                {available.map(product => {
                                    const isSelected = selected.has(product.id)
                                    return (
                                        <chakra.button
                                            key={product.id}
                                            type="button"
                                            display="flex"
                                            alignItems="center" gap={3}
                                            px={3} py={2.5}
                                            textAlign="start"
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor={isSelected ? "primary.400" : "neutral.200"}
                                            bg={isSelected ? "primary.50" : "white"}
                                            cursor="pointer"
                                            aria-pressed={isSelected}
                                            onClick={() => toggleProduct(product)}
                                            transition="all 0.15s"
                                            _hover={{ borderColor: "primary.300", bg: isSelected ? "primary.50" : "neutral.50" }}
                                        >
                                            <Flex
                                                w="8" h="8" flexShrink={0}
                                                align="center" justify="center"
                                                bg={isSelected ? "primary.100" : "success.50"}
                                                color={isSelected ? "primary.700" : "success.700"}
                                                borderRadius="md" fontSize="sm"
                                            >
                                                <FiPackage />
                                            </Flex>
                                            <Box minW="0" flex="1">
                                                <HStack gap={2} wrap="wrap">
                                                    <Text fontSize="sm" fontWeight="bold" color="neutral.900">
                                                        {product.name}
                                                    </Text>
                                                    <Badge label={tvaLabels[product.tva]} variant="neutral" tone="subtle" size="sm" />
                                                    {product.lot && (
                                                        <Badge label={`Lot: ${product.lot.name}`} variant="warning" tone="subtle" size="sm" />
                                                    )}
                                                </HStack>
                                                <Text fontSize="xs" color="neutral.600" mt={0.5}>
                                                    {product.unit} · {formatMoney(product.unitPrice)}
                                                </Text>
                                            </Box>
                                            {isSelected && (
                                                <Box
                                                    w="4" h="4" flexShrink={0}
                                                    borderRadius="full"
                                                    bg="primary.500"
                                                />
                                            )}
                                        </chakra.button>
                                    )
                                })}

                                {productsQuery.hasNextPage && (
                                    <chakra.button
                                        type="button"
                                        py={2}
                                        fontSize="sm"
                                        color="primary.700"
                                        fontWeight="medium"
                                        disabled={productsQuery.isFetchingNextPage}
                                        onClick={() => void productsQuery.fetchNextPage()}
                                    >
                                        {productsQuery.isFetchingNextPage ? <Spinner size="xs" /> : t("common.loadMore")}
                                    </chakra.button>
                                )}
                            </VStack>
                        )}
                    </Box>

                    {/* Footer */}
                    <Flex
                        align="center" justify="space-between"
                        px={5} py={4}
                        borderTop="1px solid" borderColor="neutral.200"
                        gap={3}
                    >
                        <Text fontSize="xs" color="neutral.500">
                            {selected.size > 0
                                ? `${selected.size} produit${selected.size > 1 ? "s" : ""} sélectionné${selected.size > 1 ? "s" : ""}`
                                : `${total} produit${total !== 1 ? "s" : ""} disponible${total !== 1 ? "s" : ""}`}
                        </Text>
                        <HStack gap={2}>
                            <Box w="24">
                                <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
                                    Annuler
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    type="button"
                                    variant="accent"
                                    size="sm"
                                    onClick={() => navigate(`/product/create?lotId=${lotId}`)}
                                >
                                    Nouveau produit
                                </Button>
                            </Box>
                            <Box w="32">
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    disabled={selected.size === 0 || assignMutation.isPending}
                                    onClick={handleConfirm}
                                >
                                    {assignMutation.isPending
                                        ? <Spinner size="xs" />
                                        : `Affecter${selected.size > 1 ? ` (${selected.size})` : ""}`}
                                </Button>
                            </Box>
                        </HStack>
                    </Flex>

                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default AddExistingProductModal
