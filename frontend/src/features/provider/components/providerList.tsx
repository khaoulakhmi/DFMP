import { providerApi } from "@/api/provider.api"
import { toaster } from "@/components/ui/toaster"
import Badge from "@/shared/components/atoms/badge"
import Table from "@/shared/components/organisms/Table"
import type { Provider } from "@/shared/types/provider.types"
import type { Column } from "@/shared/types/table.types"
import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

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

const columns: Column<Provider>[] = [
    {
        key: "name",
        label: "Provider",
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
        label: "Contact",
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
        label: "Address",
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

    const { data: providers = [] as Provider[], isLoading, isError } = useQuery({
        queryKey: ["providers"],
        queryFn: providerApi.getAll,
    })

    const deleteMutation = useMutation({
        mutationFn: (rows: Provider[]) =>
            Promise.all(rows.map(provider => providerApi.delete(provider.id))),
        onSuccess: (_, rows) => {
            queryClient.invalidateQueries({ queryKey: ["providers"] })
            toaster.create({
                title: `${rows.length} provider${rows.length > 1 ? "s" : ""} deleted`,
                type: "success",
            })
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to delete providers.",
                type: "error",
            })
        },
    })

    const handleEdit = (provider: Provider) => {
        navigate(`/providers/${provider.id}/edit`)
    }

    const actions = [
        {
            label: "Delete",
            variant: "danger" as const,
            onClick: (rows: Provider[]) => {
                if (window.confirm(
                    `Delete ${rows.length} provider${rows.length > 1 ? "s" : ""}?`,
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
            isLoading={isLoading}
            isError={isError}
            searchable
            searchKeys={["name", "email", "company", "phone", "bankName", "NIF", "NIS"]}
            keyExtractor={(provider) => provider.id}
            onEdit={handleEdit}
            actions={actions}
        />
    )
}

export default ProviderList
