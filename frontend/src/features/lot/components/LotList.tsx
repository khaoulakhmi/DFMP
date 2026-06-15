import { lotApi } from "@/api/lot.api"
import Badge from "@/shared/components/atoms/badge"
import Table from "@/shared/components/organisms/Table"
import type { Lot } from "@/shared/types/lot.types"
import type { Column } from "@/shared/types/table.types"
import { Text, VStack } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Link as RouterLink } from "react-router-dom"

const columns: Column<Lot>[] = [
    {
        key: "name",
        label: "Lot",
        sortable: true,
        render: (value, row) => (
            <VStack align="start" gap={0.5}>
                <Text
                    asChild
                    fontSize="sm"
                    fontWeight="semibold"
                    color="neutral.900"
                    _hover={{ color: "primary.600", textDecoration: "none" }}
                >
                    <RouterLink to={`/lots/${row.id}`}>{String(value)}</RouterLink>
                </Text>
                <Text fontSize="xs" color="neutral.500">{row.designation?.name ?? `Designation ${row.designationId}`}</Text>
            </VStack>
        ),
    },
    {
        key: "products",
        label: "Products",
        render: value => {
            const count = Array.isArray(value) ? value.length : 0
            return <Badge label={`${count} product${count === 1 ? "" : "s"}`} variant={count ? "accent" : "neutral"} />
        },
    },
    {
        key: "specificationsId",
        label: "Status",
        render: value => <Badge label={value ? "Active" : "No spec"} variant={value ? "success" : "neutral"} />,
    },
]

const LotList = () => {
    const { data: lots = [] as Lot[], isLoading, isError } = useQuery<Lot[]>({
        queryKey: ["lots"],
        queryFn: lotApi.getAll,
    })

    return (
        <Table
            data={lots}
            columns={columns}
            searchable
            searchKeys={["name"]}
            isLoading={isLoading}
            isError={isError}
            keyExtractor={lot => String(lot.id)}
        />
    )
}

export default LotList
