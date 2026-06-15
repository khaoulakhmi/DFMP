import { lotApi } from "@/api/lot.api"
import { productApi } from "@/api/product.api"
import type { Lot } from "@/shared/types/lot.types"
import type { Product } from "@/shared/types/product.types"
import { Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import LotDetailHeader from "./lotDetailsHeader"
import LotDetailMetrics from "./LotDetailMetrics"
import MarketsSection from "./MarketsSection"
import ProductsSection from "./ProductsSection"
import SpecificationSection from "./SpecificationSection"
import type { SpecificationDetails } from "./lot-detail.types"

const LotDetailPage = () => {
    const { id } = useParams<{ id: string }>()

    const { data: lot, isLoading: isLotLoading, isError: isLotError } = useQuery<Lot>({
        queryKey: ["lots", id],
        queryFn: () => lotApi.getById(String(id)),
        enabled: Boolean(id),
    })

    const { data: products = [] as Product[], isLoading: isProductsLoading } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: productApi.getAll,
    })

    if (isLotLoading || isProductsLoading) {
        return (
            <Flex h="64" align="center" justify="center">
                <Spinner color="primary.500" />
            </Flex>
        )
    }

    if (isLotError || !lot) {
        return (
            <Box p={6} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl">
                <Text color="error.600" fontWeight="medium">Lot introuvable.</Text>
            </Box>
        )
    }

    const spec = lot.specifications as SpecificationDetails | null | undefined
    const lotProducts = lot.products?.length
        ? lot.products
        : products.filter(p => p.lotId === lot.id)
    const productCount = lotProducts.length
    const marketCount = lot.specificationsId ? 1 : 0
    const invoiceCount = productCount + marketCount

    return (
        <Box p={{ base: 4, md: 6 }} maxW="7xl" mx="auto">
            <LotDetailHeader lot={lot} />

            <LotDetailMetrics
                lot={lot}
                spec={spec}
                productCount={productCount}
                marketCount={marketCount}
                invoiceCount={invoiceCount}
            />

            <VStack align="stretch" gap={7}>
                <SpecificationSection lot={lot} spec={spec} />
                <ProductsSection lot={lot} products={lotProducts} />
                <MarketsSection lot={lot} marketCount={marketCount} />
            </VStack>
        </Box>
    )
}

export default LotDetailPage