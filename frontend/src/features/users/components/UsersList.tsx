import { userApi, type UserSortField } from "@/api/user.api"
import FilterSelect from "@/shared/components/molecules/FilterSelect"
import Table from "@/shared/components/organisms/Table"
import { RoleBadge } from "@/shared/components/organisms/Table/RoleBadge"
import { StatusBadge } from "@/shared/components/organisms/Table/StatusBadge"
import { useServerTable } from "@/shared/hooks/useServerTable"
import type { Column } from "@/shared/types/table.types"
import { Role, type User } from "@/shared/types/user.type"
import { Box, HStack, Text } from "@chakra-ui/react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useI18n } from "@/shared/i18n/useI18n"

type UserFilters = { role?: Role; status?: boolean }

const UsersList = () => {
    const navigate = useNavigate()
    const { t } = useI18n()
    const table = useServerTable<UserSortField, UserFilters>({ pageSize: 10 })

    const usersQuery = useQuery({
        queryKey: ["users", "list", table.params],
        queryFn: () => userApi.list(table.params),
        placeholderData: keepPreviousData,
    })

    const columns: Column<User>[] = [
        {
            key:      "name",
            label:    t("table.name"),
            sortable: true,
            render:   (value) => (
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        w="7" h="7"
                        borderRadius="full"
                        bg="primary.100"
                        color="primary.700"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight="bold"
                        flexShrink={0}
                    >
                        {String(value).charAt(0).toUpperCase()}
                    </Box>
                    <Text fontSize="sm" fontWeight="medium" color="neutral.900">
                        {String(value)}
                    </Text>
                </Box>
            )
        },
        {
            key:      "username",
            label:    t("table.username"),
            sortable: true,
            render:   (value) => (
                <Text fontSize="sm" color="neutral.500">
                    @{String(value)}
                </Text>
            )
        },
        {
            key:      "role",
            label:    t("table.role"),
            sortable: true,
            render:   (value) => <RoleBadge value={String(value)} />,
        },
        {
            key:    "status",
            label:  t("table.status"),
            render: (value) => <StatusBadge value={value as boolean} />,
        },
    ]

    const statusValue = table.filters.status === undefined ? "" : String(table.filters.status)

    return (
        <Table
            data={usersQuery.data?.data ?? []}
            columns={columns}
            searchable
            server={table.tableState(usersQuery.data?.pagination, usersQuery.isFetching)}
            filters={(
                <HStack gap={2} flexWrap="wrap">
                    <FilterSelect
                        label={t("table.role")}
                        value={table.filters.role ?? ""}
                        onChange={value => table.setFilter("role", value ? value as Role : undefined)}
                        options={[
                            { value: "", label: t("common.all") },
                            ...Object.values(Role).map(role => ({ value: role, label: t(`roles.${role}`) })),
                        ]}
                    />
                    <FilterSelect
                        label={t("table.status")}
                        value={statusValue}
                        onChange={value => table.setFilter("status", value === "" ? undefined : value === "true")}
                        options={[
                            { value: "", label: t("common.all") },
                            { value: "true", label: t("common.active") },
                            { value: "false", label: t("common.inactive") },
                        ]}
                    />
                </HStack>
            )}
            isLoading={usersQuery.isLoading}
            isError={usersQuery.isError}
            onRetry={() => void usersQuery.refetch()}
            keyExtractor={user => user.id}
            onEdit={user => navigate(`/users/${user.id}/edit`)}
        />
    )
}

export default UsersList
