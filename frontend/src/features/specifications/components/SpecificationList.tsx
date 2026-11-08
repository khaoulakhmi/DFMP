import { specificationApi, type SpecificationSortField } from "@/api/specification.api"
import Badge from "@/shared/components/atoms/badge"
import Table from "@/shared/components/organisms/Table"
import { useServerTable } from "@/shared/hooks/useServerTable"
import type { Specification } from "@/shared/types/specification.types"
import type { Column } from "@/shared/types/table.types"
import { HStack, Text, VStack } from "@chakra-ui/react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { FiArrowUpRight } from "react-icons/fi"
import { Link as RouterLink } from "react-router-dom"
import { formatMoney } from "./specification.utils"

const columns: Column<Specification>[] = [
    {
        key: "type",
        label: "Cahier de charge",
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
                    <RouterLink to={`/specifications/${row.id}`}>
                        <HStack gap={1}>{String(value)} <FiArrowUpRight /></HStack>
                    </RouterLink>
                </Text>
                <Text fontSize="xs" color="neutral.500">
                    {row.designation?.name ?? `Designation ${row.designationId}`} - {row.year}
                </Text>
            </VStack>
        ),
    },
    {
        key: "visaNumber",
        label: "Visa",
        render: value => <Text fontSize="sm">{value ? String(value) : "-"}</Text>,
    },
    {
        key: "minAmount",
        label: "Montant min",
        sortable: true,
        render: value => <Text fontSize="sm" fontWeight="medium">{formatMoney(Number(value))}</Text>,
    },
    {
        key: "maxAmount",
        label: "Montant max",
        sortable: true,
        render: value => <Text fontSize="sm" fontWeight="medium">{formatMoney(Number(value))}</Text>,
    },
    {
        key: "year",
        label: "Annee",
        sortable: true,
        render: value => <Text fontSize="sm">{String(value)}</Text>,
    },
    {
        key: "_count",
        label: "Lots",
        render: (_, row) => {
            const count = row._count?.lots ?? row.lots?.length ?? 0
            return <Badge label={`${count} lot${count === 1 ? "" : "s"}`} variant={count ? "accent" : "neutral"} />
        },
    },
    {
        key: "tendering",
        label: "Evaluation",
        render: value => <Badge label={value ? "Suivie" : "Non suivie"} variant={value ? "success" : "neutral"} />,
    },
]

const SpecificationList = () => {
    const table = useServerTable<SpecificationSortField>({ pageSize: 10 })

    const specificationsQuery = useQuery({
        queryKey: ["specifications", "list", table.params],
        queryFn: () => specificationApi.list(table.params),
        placeholderData: keepPreviousData,
    })

    return (
        <Table
            data={specificationsQuery.data?.data ?? []}
            columns={columns}
            searchable
            server={table.tableState(specificationsQuery.data?.pagination, specificationsQuery.isFetching)}
            isLoading={specificationsQuery.isLoading}
            isError={specificationsQuery.isError}
            onRetry={() => void specificationsQuery.refetch()}
            keyExtractor={specification => String(specification.id)}
        />
    )
}

export default SpecificationList
