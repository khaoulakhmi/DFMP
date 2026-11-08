import { providerApi, type ProviderSortField } from "@/api/provider.api"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import Badge from "@/shared/components/atoms/badge"
import Table from "@/shared/components/organisms/Table"
import type { Provider } from "@/shared/types/provider.types"
import type { Column } from "@/shared/types/table.types"
import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useServerTable } from "@/shared/hooks/useServerTable"
import { useNavigate } from "react-router-dom"
import { useI18n } from "@/shared/i18n/useI18n"

const EMPTY_VALUE = "Not provided"

const displayValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return EMPTY_VALUE
    return String(value)
}

const getInitials = (name: unknown, company: unknown) => {
    const source = displayValue(name) !== EMPTY_VALUE ? String(name) : String(company ?? "")
    const words = source.trim().split(/\s+/).filter(Boolean)

    if (words.length === 0) return "?"
    if (words.length === 1) return words[0]?.charAt(0).toUpperCase() ?? "?"

    return `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`.toUpperCase()
}

const formatAccountNumber = (value: unknown) => {
    const raw = displayValue(value)
    if (raw === EMPTY_VALUE) return raw

    return raw.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim()
}

const renderMutedValue = (value: unknown) => (
    <Text fontSize="sm" color={displayValue(value) === EMPTY_VALUE ? "neutral.400" : "neutral.700"}>
        {displayValue(value)}
    </Text>
)

const csvHeaders: Array<{ key: keyof Provider, label: string }> = [
    { key: "name", label: "Name" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "bankName", label: "Bank" },
    { key: "bankAccountNumber", label: "Bank Account Number" },
    { key: "NIF", label: "NIF" },
    { key: "NIS", label: "NIS" },
    { key: "commercialRegisterNumber", label: "Commercial Register Number" },
    { key: "articleNumber", label: "Article Number" },
]

const escapeCsvValue = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value)
    return `"${text.replace(/"/g, '""')}"`
}

const exportProviders = (rows: Provider[]) => {
    const header = csvHeaders.map(({ label }) => escapeCsvValue(label)).join(",")
    const body = rows.map(row =>
        csvHeaders.map(({ key }) => escapeCsvValue(row[key])).join(",")
    )
    const csv = [header, ...body].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = `providers-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
}

const createProviderColumns = (t: ReturnType<typeof useI18n>["t"]): Column<Provider>[] => [
    {
        key: "name",
        label: t("provider"),
        sortable: true,
        render: (value, row) => (
            <HStack gap={3}>
                <Box
                    w="9"
                    h="9"
                    borderRadius="md"
                    bg="primary.50"
                    color="primary.700"
                    border="1px solid"
                    borderColor="primary.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    flexShrink={0}
                >
                    {getInitials(value, row.company)}
                </Box>
                <Box minW="44">
                    <Text fontSize="sm" fontWeight="semibold" color="neutral.900">
                        {displayValue(value)}
                    </Text>
                    <HStack mt={1} gap={2}>
                        <Badge
                            label={displayValue(row.company)}
                            variant={displayValue(row.company) === EMPTY_VALUE ? "neutral" : "primary"}
                            tone="subtle"
                            size="sm"
                        />
                    </HStack>
                </Box>
            </HStack>
        ),
    },
    {
        key: "email",
        label: t("provider.email"),
        sortable: true,
        render: (value, row) => (
            <VStack align="start" gap={0.5}>
                <Text
                    fontSize="sm"
                    color={displayValue(value) === EMPTY_VALUE ? "neutral.400" : "primary.700"}
                    fontWeight="medium"
                >
                    {displayValue(value)}
                </Text>
                <Text fontSize="xs" color="neutral.400">
                    {displayValue(row.phone)}
                </Text>
            </VStack>
        ),
    },
    {
        key: "address",
        label: t("provider.address"),
        render: (value) => (
            <Text
                fontSize="sm"
                color={displayValue(value) === EMPTY_VALUE ? "neutral.400" : "neutral.600"}
                maxW="56"
                overflow="hidden"
                textOverflow="ellipsis"
                title={displayValue(value)}
            >
                {displayValue(value)}
            </Text>
        ),
    },
    {
        key: "bankName",
        label: "Bank",
        render: (value, row) => (
            <VStack align="start" gap={0.5}>
                {renderMutedValue(value)}
                <Text fontSize="xs" color="neutral.400" fontFamily="mono">
                    {formatAccountNumber(row.bankAccountNumber)}
                </Text>
            </VStack>
        ),
    },
    {
        key: "NIF",
        label: "Tax Info",
        render: (value, row) => (
            <VStack align="start" gap={1}>
                <HStack gap={1}>
                    <Badge label="NIF" variant="secondary" tone="outline" size="sm" />
                    <Text fontSize="xs" fontFamily="mono" color="neutral.700">
                        {displayValue(value)}
                    </Text>
                </HStack>
                <HStack gap={1}>
                    <Badge label="NIS" variant="secondary" tone="outline" size="sm" />
                    <Text fontSize="xs" fontFamily="mono" color="neutral.700">
                        {displayValue(row.NIS)}
                    </Text>
                </HStack>
            </VStack>
        ),
    },
    {
        key: "commercialRegisterNumber",
        label: "Legal",
        render: (value, row) => (
            <VStack align="start" gap={1}>
                <HStack gap={1}>
                    <Badge label="RC" variant="accent" tone="outline" size="sm" />
                    <Text fontSize="xs" fontFamily="mono" color="neutral.700">
                        {displayValue(value)}
                    </Text>
                </HStack>
                <HStack gap={1}>
                    <Badge label="Art" variant="accent" tone="outline" size="sm" />
                    <Text fontSize="xs" fontFamily="mono" color="neutral.700">
                        {displayValue(row.articleNumber)}
                    </Text>
                </HStack>
            </VStack>
        ),
    },
]

const ProviderList = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { t } = useI18n()
    const columns = createProviderColumns(t)

    const table = useServerTable<ProviderSortField>({ pageSize: 10 })

    const providersQuery = useQuery({
        queryKey: ["providers", "list", table.params],
        queryFn: () => providerApi.list(table.params),
        placeholderData: keepPreviousData,
    })

    const providers = providersQuery.data?.data ?? []

    const deleteMutation = useMutation({
        mutationFn: async (rows: Provider[]) => {
            const results = await Promise.allSettled(
                rows.map(provider => providerApi.delete(provider.id))
            )

            return {
                succeeded: results.filter(result => result.status === "fulfilled").length,
                failed: results.filter(result => result.status === "rejected").length,
            }
        },

        onSuccess: ({ succeeded, failed }) => {
            toaster.create({
                title: failed === 0
                    ? "Providers deleted"
                    : "Some providers could not be deleted",
                description: `${succeeded} deleted, ${failed} failed.`,
                type: failed === 0 ? "success" : "warning",
            })
        },

        onError: () => {
            toaster.create({
                title: "Deletion failed",
                description: "An unexpected error occurred. Please try again.",
                type: "error",
            })
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["providers"] }),
                queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
            ])
        },
    })

    const handleEdit = (provider: Provider) => {
        navigate(`/providers/${provider.id}/edit`)
    }

    const actions = [
        {
            label: t("providers.delete"),
            variant: "danger" as const,
            onClick: (rows: Provider[]) => {
                if (window.confirm(
                    t("providers.confirmDelete"),
                )) {
                    deleteMutation.mutate(rows)
                }
            },
        },
        {
            label: "Export",
            variant: "secondary" as const,
            onClick: (rows: Provider[]) => {
                exportProviders(rows)
                toaster.create({
                    title: `${rows.length} provider${rows.length > 1 ? "s" : ""} exported`,
                    type: "success",
                })
            },
        },
    ]

    return (
        <Table
            data={providers}
            columns={columns}
            isLoading={providersQuery.isLoading}
            isError={providersQuery.isError}
            onRetry={() => void providersQuery.refetch()}
            searchable
            server={table.tableState(providersQuery.data?.pagination, providersQuery.isFetching)}
            keyExtractor={(provider) => provider.id}
            onEdit={handleEdit}
            actions={actions}
        />
    )
}

export default ProviderList
