import { productApi, type ProductSortField } from "@/api/product.api"
import Badge from "@/shared/components/atoms/badge"
import FilterSelect from "@/shared/components/molecules/FilterSelect"
import Table from "@/shared/components/organisms/Table"
import { useServerTable } from "@/shared/hooks/useServerTable"
import { useI18n } from "@/shared/i18n/useI18n"
import type { Product, TVA } from "@/shared/types/product.types"
import type { Column } from "@/shared/types/table.types"
import { Text, VStack } from "@chakra-ui/react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useNavigate, Link as RouterLink} from "react-router-dom"

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
                <Text fontSize="sm" fontWeight="semibold" color="neutral.900">
                    <RouterLink to={`/products/${row.id}`}>{String(value)}</RouterLink>    
                </Text>
                <Text fontSize="xs" color="neutral.500">
                    {row.lot?.name ?? (row.lotId ? `Lot ${row.lotId}` : "No lot")} - {row.designation?.name ?? `Designation ${row.designationId}`}
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

type ProductFilters = { tva?: TVA }

const ProductList = () => {
    const navigate = useNavigate()
    const { t } = useI18n()
    const table = useServerTable<ProductSortField, ProductFilters>({ pageSize: 10 })

    const productsQuery = useQuery({
        queryKey: ["products", "list", table.params],
        queryFn: () => productApi.list(table.params),
        placeholderData: keepPreviousData,
    })

    const products = productsQuery.data?.data ?? []

    return (
        <VStack align="stretch" gap={4}>
            
            <Table
                data={products}
                columns={columns}
                searchable
                server={table.tableState(productsQuery.data?.pagination, productsQuery.isFetching)}
                filters={(
                    <FilterSelect
                        label="TVA"
                        value={table.filters.tva ?? ""}
                        onChange={value => table.setFilter("tva", value ? value as TVA : undefined)}
                        options={[
                            { value: "", label: t("common.all") },
                            ...(Object.keys(tvaLabels) as TVA[]).map(tva => ({ value: tva, label: tvaLabels[tva] })),
                        ]}
                    />
                )}
                isLoading={productsQuery.isLoading}
                isError={productsQuery.isError}
                onRetry={() => void productsQuery.refetch()}
                keyExtractor={product => String(product.id)}
                onEdit={product => navigate(`/products/${product.id}/edit`)}
            />
        </VStack>
    )
}

export default ProductList
