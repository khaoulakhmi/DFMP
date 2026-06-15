import { productApi } from "@/api/product.api"
import Badge from "@/shared/components/atoms/badge"
import Button from "@/shared/components/atoms/button"
import type { Product } from "@/shared/types/product.types"
import {
    Box,
    Dialog,
    Flex,
    HStack,
    Input,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { FiPackage, FiSearch, FiX } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { formatMoney, tvaLabels } from "./lot-detail.types"

type Props = {
    open: boolean
    onClose: () => void
    lotId: number
    alreadyAssigned: number[]
}

const AddExistingProductModal = ({ open, onClose, lotId, alreadyAssigned }: Props) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const { data: allProducts = [], isLoading } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: productApi.getAll,
    })

    const available = useMemo(
        () => allProducts.filter(p =>
            !alreadyAssigned.includes(p.id) &&
            p.name.toLowerCase().includes(search.toLowerCase())
        ),
        [allProducts, alreadyAssigned, search]
    )

    const { mutate: assign, isPending } = useMutation({
        mutationFn: (productId: number) =>
            productApi.update(productId, { lotId }),
        onSuccess: (_data, productId) => {
            // called once per product; only close after last one
            setSelectedIds(prev => {
                const remaining = prev.filter(id => id !== productId)
                if (remaining.length === 0) {
                    queryClient.invalidateQueries({ queryKey: ["lots"] })
                    queryClient.invalidateQueries({ queryKey: ["products"] })
                    handleClose()
                }
                return remaining
            })
        },
    })

    const handleClose = () => {
        setSearch("")
        setSelectedIds([])
        onClose()
    }

    const toggleProduct = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const handleConfirm = () => {
        if (selectedIds.length === 0) return
        for (const id of selectedIds) assign(id)
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
                        {isLoading ? (
                            <Flex h="40" align="center" justify="center">
                                <Spinner color="primary.500" size="sm" />
                            </Flex>
                        ) : available.length === 0 ? (
                            <Flex h="40" align="center" justify="center" direction="column" gap={2}>
                                <Box color="neutral.400" fontSize="2xl"><FiPackage /></Box>
                                <Text fontSize="sm" color="neutral.500">
                                    {search ? "Aucun produit trouvé" : "Tous les produits sont déjà dans ce lot"}
                                </Text>
                            </Flex>
                        ) : (
                            <VStack align="stretch" gap={2} py={2}>
                                {available.map(product => {
                                    const isSelected = selectedIds.includes(product.id)
                                    return (
                                        <Flex
                                            key={product.id}
                                            align="center" gap={3}
                                            px={3} py={2.5}
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor={isSelected ? "primary.400" : "neutral.200"}
                                            bg={isSelected ? "primary.50" : "white"}
                                            cursor="pointer"
                                            onClick={() => toggleProduct(product.id)}
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
                                        </Flex>
                                    )
                                })}
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
                            {selectedIds.length > 0
                                ? `${selectedIds.length} produit${selectedIds.length > 1 ? "s" : ""} sélectionné${selectedIds.length > 1 ? "s" : ""}`
                                : `${available.length} produit${available.length !== 1 ? "s" : ""} disponible${available.length !== 1 ? "s" : ""}`}
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
                                    disabled={selectedIds.length === 0 || isPending}
                                    onClick={handleConfirm}
                                >
                                    {isPending
                                        ? <Spinner size="xs" />
                                        : `Affecter${selectedIds.length > 1 ? ` (${selectedIds.length})` : ""}`}
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