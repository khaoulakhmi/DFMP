import { lotApi } from "@/api/lot.api"
import type { Lot } from "@/shared/types/lot.types"
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

    if (isLotLoading) {
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
    // The lot detail endpoint returns all of the lot's products.
    const lotProducts = lot.products ?? []
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