import { productApi } from "@/api/product.api"
import Button from "@/shared/components/atoms/button"
import Badge from "@/shared/components/atoms/badge"
import Table from "@/shared/components/organisms/Table"
import type { Product, TVA } from "@/shared/types/product.types"
import type { Column } from "@/shared/types/table.types"
import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { FiPlus } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const tvaLabels: Record<TVA, string> = {
    ZERO: "TVA 0%",
    NINE: "TVA 9%",
    NINETEEN: "TVA 19%",
}

const columns: Column<Product>[] = [
    {
        key: "name",
        label: "Product",
        sortable: true,
        render: (value, row) => (
            <VStack align="start" gap={0.5}>
                <Text fontSize="sm" fontWeight="semibold" color="neutral.900">{String(value)}</Text>
                <Text fontSize="xs" color="neutral.500">
                    {row.lot?.name ?? `Lot ${row.lotId}`} - {row.designation?.name ?? `Designation ${row.designationId}`}
                </Text>
            </VStack>
        ),
    },
    { key: "unit", label: "Unit", sortable: true },
    {
        key: "unitPrice",
        label: "Unit Price",
        sortable: true,
        render: value => <Text fontWeight="semibold">{Number(value).toFixed(2)} DA</Text>,
    },
    {
        key: "providerPrice",
        label: "Provider Price",
        render: value => <Text>{Number(value).toFixed(2)} DA</Text>,
    },
    {
        key: "tva",
        label: "TVA",
        render: value => <Badge label={tvaLabels[value as TVA]} variant="warning" tone="subtle" />,
    },
    {
        key: "quantityMin",
        label: "Quantity",
        render: (_, row) => <Text>{row.quantityMin} - {row.quantityMax}</Text>,
    },
]

const ProductList = () => {
    const navigate = useNavigate()
    const { data: products = [] as Product[], isLoading, isError } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: productApi.getAll,
    })

    return (
        <VStack align="stretch" gap={4}>
            <HStack justify="space-between" align="center">
                <Box>
                    <Text fontSize="lg" fontWeight="semibold" color="neutral.900">Products</Text>
                    <Text fontSize="sm" color="neutral.500">Browse catalog products.</Text>
                </Box>
                <Box w="44">
                    <Button onClick={() => navigate("/product/create")}>
                        <HStack justify="center" gap={2}><FiPlus /><Text>Add Product</Text></HStack>
                    </Button>
                </Box>
            </HStack>
            <Table
                data={products}
                columns={columns}
                searchable
                searchKeys={["name", "unit"]}
                isLoading={isLoading}
                isError={isError}
                keyExtractor={product => String(product.id)}
                onEdit={product => navigate(`/products/${product.id}/edit`)}
            />
        </VStack>
    )
}

export default ProductList
