import { lotApi, type LotSortField } from "@/api/lot.api"
import Badge from "@/shared/components/atoms/badge"
import FilterSelect from "@/shared/components/molecules/FilterSelect"
import Table from "@/shared/components/organisms/Table"
import { useServerTable } from "@/shared/hooks/useServerTable"
import { useI18n } from "@/shared/i18n/useI18n"
import type { Lot } from "@/shared/types/lot.types"
import type { Column } from "@/shared/types/table.types"
import { Text, VStack } from "@chakra-ui/react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
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
        key: "_count",
        label: "Products",
        render: (_, row) => {
            const count = row._count?.products ?? row.products?.length ?? 0
            return <Badge label={`${count} product${count === 1 ? "" : "s"}`} variant={count ? "accent" : "neutral"} />
        },
    },
    {
        key: "specificationsId",
        label: "Status",
        render: value => <Badge label={value ? "Active" : "No spec"} variant={value ? "success" : "neutral"} />,
    },
]

type LotFilters = { hasSpecification?: boolean }

const LotList = () => {
    const { t } = useI18n()
    const table = useServerTable<LotSortField, LotFilters>({ pageSize: 10 })

    const lotsQuery = useQuery({
        queryKey: ["lots", "list", table.params],
        queryFn: () => lotApi.list(table.params),
        placeholderData: keepPreviousData,
    })

    const statusValue = table.filters.hasSpecification === undefined
        ? ""
        : String(table.filters.hasSpecification)

    return (
        <Table
            data={lotsQuery.data?.data ?? []}
            columns={columns}
            searchable
            server={table.tableState(lotsQuery.data?.pagination, lotsQuery.isFetching)}
            filters={(
                <FilterSelect
                    label="Status"
                    value={statusValue}
                    onChange={value => table.setFilter(
                        "hasSpecification",
                        value === "" ? undefined : value === "true",
                    )}
                    options={[
                        { value: "", label: t("common.all") },
                        { value: "true", label: t("dashboard.activeLots") },
                        { value: "false", label: t("dashboard.lotsWithoutSpecification") },
                    ]}
                />
            )}
            isLoading={lotsQuery.isLoading}
            isError={lotsQuery.isError}
            onRetry={() => void lotsQuery.refetch()}
            keyExtractor={lot => String(lot.id)}
        />
    )
}

export default LotList
