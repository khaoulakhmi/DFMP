import { designationApi } from "@/api/designation.api"
import Button from "@/shared/components/atoms/button"
import Badge from "@/shared/components/atoms/badge"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import Table from "@/shared/components/organisms/Table"
import type { Designation } from "@/shared/types/designation.types"
import type { Column } from "@/shared/types/table.types"
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FiPlus } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import CreateDesignationModal from "./createDesignationModal"

const EMPTY_VALUE = "Not provided"

const displayValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return EMPTY_VALUE
    return String(value)
}

const getInitials = (name: unknown) => {
    const words = displayValue(name).trim().split(/\s+/).filter(Boolean)

    if (words.length === 0 || displayValue(name) === EMPTY_VALUE) return "D"
    if (words.length === 1) return words[0]?.charAt(0).toUpperCase() ?? "D"

    return `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`.toUpperCase()
}

const countItems = (items: unknown) => Array.isArray(items) ? items.length : 0

const columns: Column<Designation>[] = [
    {
        key: "name",
        label: "Designation",
        sortable: true,
        render: (value, row) => (
            <HStack gap={3}>
                <Box
                    w="9"
                    h="9"
                    borderRadius="md"
                    bg="secondary.50"
                    color="secondary.700"
                    border="1px solid"
                    borderColor="secondary.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    flexShrink={0}
                >
                    {getInitials(value)}
                </Box>
                <Box minW="44">
                    <Text fontSize="sm" fontWeight="semibold" color="neutral.900">
                        {displayValue(value)}
                    </Text>
                    <Text
                        mt={1}
                        fontSize="xs"
                        color={displayValue(row.description) === EMPTY_VALUE ? "neutral.400" : "neutral.500"}
                        maxW="72"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        title={displayValue(row.description)}
                    >
                        {displayValue(row.description)}
                    </Text>
                </Box>
            </HStack>
        ),
    },
    {
        key: "lots",
        label: "Lots",
        render: (value) => (
            <Badge
                label={`${countItems(value)} lot${countItems(value) === 1 ? "" : "s"}`}
                variant={countItems(value) > 0 ? "primary" : "neutral"}
                tone="subtle"
                size="sm"
            />
        ),
    },
    {
        key: "products",
        label: "Products",
        render: (value) => (
            <Badge
                label={`${countItems(value)} product${countItems(value) === 1 ? "" : "s"}`}
                variant={countItems(value) > 0 ? "accent" : "neutral"}
                tone="subtle"
                size="sm"
            />
        ),
    },
    {
        key: "specifications",
        label: "Specifications",
        render: (value) => (
            <Badge
                label={`${countItems(value)} spec${countItems(value) === 1 ? "" : "s"}`}
                variant={countItems(value) > 0 ? "secondary" : "neutral"}
                tone="outline"
                size="sm"
            />
        ),
    },
]

const DesignationList = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const { data: designations = [] as Designation[], isLoading, isError } = useQuery({
        queryKey: ["designations"],
        queryFn: designationApi.getAll,
    })

    const deleteMutation = useMutation({
        mutationFn: (rows: Designation[]) =>
            Promise.all(rows.map(designation => designationApi.delete(String(designation.id)))),
        onSuccess: (_, rows) => {
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            toaster.create({
                title: `${rows.length} designation${rows.length > 1 ? "s" : ""} deleted`,
                type: "success",
            })
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to delete designations.",
                type: "error",
            })
        },
    })

    const handleEdit = (designation: Designation) => {
        navigate(`/designations/${designation.id}/edit`)
    }

    const actions = [
        {
            label: deleteMutation.isPending ? "Deleting..." : "Delete",
            variant: "danger" as const,
            onClick: (rows: Designation[]) => {
                if (window.confirm(
                    `Delete ${rows.length} designation${rows.length > 1 ? "s" : ""}?`,
                )) {
                    deleteMutation.mutate(rows)
                }
            },
        },
    ]

    return (
        <VStack align="stretch" gap={4}>
            <CreateDesignationModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <Flex
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={3}
            >
                <Box>
                    <Text fontSize="lg" fontWeight="semibold" color="neutral.900">
                        Designations
                    </Text>
                    <Text fontSize="sm" color="neutral.500">
                        Manage product and lot categories used across specifications.
                    </Text>
                </Box>
                <Box w={{ base: "full", md: "52" }}>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <HStack gap={2} justify="center">
                            <FiPlus />
                            <Text as="span">Add Designation</Text>
                        </HStack>
                    </Button>
                </Box>
            </Flex>

            <Table
                data={designations}
                columns={columns}
                searchable
                searchKeys={["name", "description"]}
                isError={isError}
                isLoading={isLoading}
                keyExtractor={(designation) => String(designation.id)}
                onEdit={handleEdit}
                actions={actions}
            />
        </VStack>
    )
}

export default DesignationList
