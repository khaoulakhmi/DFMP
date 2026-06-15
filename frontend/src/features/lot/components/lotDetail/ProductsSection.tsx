import Badge from "@/shared/components/atoms/badge"
import Button from "@/shared/components/atoms/button"
import type { Lot } from "@/shared/types/lot.types"
import type { Product } from "@/shared/types/product.types"
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { FiChevronRight, FiLink, FiPackage, FiPlus, FiShoppingCart } from "react-icons/fi"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DetailSection } from "./lot-detail.components"
import { formatMoney, tvaLabels, tvaRate } from "./lot-detail.types"
import AddExistingProductModal from "./Addexistingproductmodal "

const ProductRow = ({ product }: { product: Product }) => {
    const navigate = useNavigate()
    const priceTtc = product.unitPrice * (1 + tvaRate(product.tva))

    return (
        <Flex
            align={{ base: "stretch", sm: "center" }}
            direction={{ base: "column", sm: "row" }}
            gap={3}
            bg="white"
            border="1px solid"
            borderColor="neutral.200"
            borderRadius="lg"
            px={4} py={3}
            minH="16"
        >
            <Flex w="9" h="9" align="center" justify="center" bg="success.50" color="success.700" borderRadius="md" flexShrink={0}>
                <FiPackage />
            </Flex>
            <Box minW="0" flex="1">
                <HStack gap={2} wrap="wrap">
                    <Text fontSize="sm" fontWeight="bold" color="neutral.900">{product.name}</Text>
                    <Badge label={tvaLabels[product.tva]} variant="neutral" tone="subtle" size="sm" />
                </HStack>
                <Text fontSize="xs" color="neutral.700" mt={1}>
                    {product.unit} - Qte: {product.quantityMin} - {product.quantityMax}
                </Text>
            </Box>
            <Box textAlign={{ base: "left", sm: "right" }} flexShrink={0}>
                <Text fontSize="sm" fontWeight="bold" color="neutral.900">{formatMoney(product.unitPrice)}</Text>
                <Text fontSize="xs" color="neutral.700">{formatMoney(priceTtc)} TTC</Text>
            </Box>
            <Box w="10" flexShrink={0}>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Voir ${product.name}`}
                    title={`Voir ${product.name}`}
                    onClick={() => navigate(`/products/${product.id}`)}
                >
                    <FiChevronRight />
                </Button>
            </Box>
        </Flex>
    )
}

type Props = {
    lot: Lot
    products: Product[]
}

const ProductsSection = ({ lot, products }: Props) => {
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const assignedIds = products.map(p => p.id)

    return (
        <>
            <DetailSection
                title={`Produits (${products.length})`}
                icon={<FiShoppingCart />}
                action={(
                    <HStack gap={2}>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setModalOpen(true)}
                        >
                            <HStack justify="center" gap={1}>
                                <FiPlus />
                                <Text>Nouveau</Text>
                            </HStack>
                        </Button>
                    </HStack>
                )}
            >
                {products.length === 0 ? (
                    <Flex
                        bg="white" border="1px solid" borderColor="neutral.200"
                        borderRadius="lg" h="24" align="center" justify="center"
                        direction="column" gap={2}
                    >
                        <Text fontSize="sm" color="neutral.500">Aucun produit dans ce lot.</Text>
                        <HStack gap={2}>
                            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
                                <HStack gap={1}><FiLink /><Text>Affecter un existant</Text></HStack>
                            </Button>
                            <Button type="button" variant="secondary" size="sm" onClick={() => navigate(`/product/create?lotId=${lot.id}`)}>
                                <HStack gap={1}><FiPlus /><Text>Creer un nouveau</Text></HStack>
                            </Button>
                        </HStack>
                    </Flex>
                ) : (
                    <VStack align="stretch" gap={2}>
                        {products.map(product => <ProductRow key={product.id} product={product} />)}
                    </VStack>
                )}
            </DetailSection>

            <AddExistingProductModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                lotId={lot.id}
                alreadyAssigned={assignedIds}
            />
        </>
    )
}

export default ProductsSection