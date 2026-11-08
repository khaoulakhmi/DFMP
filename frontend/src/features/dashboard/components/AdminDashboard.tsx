import { dashboardApi } from "@/api/dashboard.api"
import { userApi } from "@/api/user.api"
import Button from "@/shared/components/atoms/button"
import { useI18n } from "@/shared/i18n/useI18n"
import { Box, Flex, Grid, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { FiBox, FiBriefcase, FiChevronRight, FiPackage, FiUsers } from "react-icons/fi"
import { Link as RouterLink } from "react-router-dom"
import DashboardStatCard from "./DashboardStatCard"

const RECENT_USERS_LIMIT = 4

const AdminDashboard = () => {
    const { language, t } = useI18n()

    // Every count is computed by the backend, so totals stay right at any size.
    const summaryQuery = useQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: () => dashboardApi.getSummary(),
    })

    // Newest users first, limited on the server.
    const recentUsersQuery = useQuery({
        queryKey: ["users", "list", { page: 1, pageSize: RECENT_USERS_LIMIT, sortBy: "createdAt", sortOrder: "desc" }],
        queryFn: () => userApi.list({
            page: 1,
            pageSize: RECENT_USERS_LIMIT,
            sortBy: "createdAt",
            sortOrder: "desc",
        }),
    })

    const summary = summaryQuery.data
    const recentUsers = recentUsersQuery.data?.data ?? []

    // "—" while loading, "!" when the request failed, otherwise the number.
    const statValue = (value: number | undefined) =>
        summaryQuery.isError ? "!" : value ?? "—"

    return (
        <VStack align="stretch" gap={7}>
            <Flex align={{ base: "start", sm: "center" }} justify="space-between" gap={4} direction={{ base: "column", sm: "row" }}>
                <Box>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="neutral.900">{t("dashboard.adminTitle")}</Text>
                    <Text mt={1} color="neutral.500">{t("dashboard.adminDescription")}</Text>
                </Box>
                <Text px={3} py={1.5} bg="primary.50" borderRadius="full" color="primary.700" fontSize="sm" fontWeight="medium">{t("dashboard.administrator")}</Text>
            </Flex>

            {summaryQuery.isError && (
                <Flex
                    p={4} gap={3} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl"
                    align={{ base: "stretch", sm: "center" }} justify="space-between" direction={{ base: "column", sm: "row" }}
                >
                    <Text color="error.600" fontSize="sm" fontWeight="medium">{t("dashboard.summaryError")}</Text>
                    <Box w={{ base: "full", sm: "32" }}>
                        <Button variant="secondary" size="sm" onClick={() => void summaryQuery.refetch()}>{t("common.retry")}</Button>
                    </Box>
                </Flex>
            )}

            <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap={4}>
                <DashboardStatCard label={t("users")} value={statValue(summary?.users.total)} icon={<FiUsers />} accent="primary" />
                <DashboardStatCard label={t("providers")} value={statValue(summary?.providers.total)} icon={<FiBriefcase />} accent="secondary" />
                <DashboardStatCard label={t("lots")} value={statValue(summary?.lots.total)} icon={<FiBox />} accent="accent" />
                <DashboardStatCard label={t("products")} value={statValue(summary?.products.total)} icon={<FiPackage />} accent="success" />
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", lg: "1.35fr 1fr" }} gap={5}>
                <Box bg="white" borderWidth="1px" borderColor="neutral.200" borderRadius="xl" p={{ base: 4, md: 5 }}>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Box>
                            <Text fontWeight="semibold" color="neutral.900">{t("dashboard.users")}</Text>
                            <Text fontSize="sm" color="neutral.500">{t("dashboard.recentUsersDescription")}</Text>
                        </Box>
                        <Text asChild color="primary.700" fontSize="sm" fontWeight="semibold" _hover={{ textDecoration: "underline" }}>
                            <RouterLink to="/users">{t("common.viewAll")}</RouterLink>
                        </Text>
                    </Flex>

                    {recentUsersQuery.isLoading ? (
                        <Flex minH="140px" align="center" justify="center"><Spinner color="primary.500" /></Flex>
                    ) : recentUsersQuery.isError ? (
                        <Flex minH="140px" direction="column" align="center" justify="center" gap={3}>
                            <Text color="error.600" fontSize="sm">{t("dashboard.recentUsersError")}</Text>
                            <Box w="32">
                                <Button variant="secondary" size="sm" onClick={() => void recentUsersQuery.refetch()}>{t("common.retry")}</Button>
                            </Box>
                        </Flex>
                    ) : recentUsers.length ? (
                        <VStack align="stretch" gap={0}>
                            {recentUsers.map(user => (
                                <HStack key={user.id} justify="space-between" py={3} borderTopWidth="1px" borderColor="neutral.100">
                                    <HStack gap={3} minW={0}>
                                        <Flex boxSize="9" flexShrink={0} align="center" justify="center" borderRadius="full" bg="primary.100" color="primary.700" fontWeight="bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </Flex>
                                        <Box minW={0}>
                                            <Text fontWeight="medium" color="neutral.900" truncate>{user.name}</Text>
                                            <Text fontSize="sm" color="neutral.500" truncate>@{user.username}</Text>
                                        </Box>
                                    </HStack>
                                    <Text flexShrink={0} color="neutral.500" fontSize="sm">{new Intl.DateTimeFormat(language, { day: "numeric", month: "short", year: "numeric" }).format(new Date(user.createdAt))}</Text>
                                </HStack>
                            ))}
                        </VStack>
                    ) : <Text py={8} textAlign="center" color="neutral.500">{t("dashboard.noUsers")}</Text>}
                </Box>

                <VStack align="stretch" gap={5}>
                    <Box bg="white" borderWidth="1px" borderColor="neutral.200" borderRadius="xl" p={5}>
                        <Text fontWeight="semibold" color="neutral.900">{t("dashboard.lotStatus")}</Text>
                        <Text mt={1} fontSize="sm" color="neutral.500">{t("dashboard.lotStatusDescription")}</Text>
                        <HStack mt={5} justify="space-between">
                            <Box><Text fontSize="2xl" fontWeight="bold" color="success.600">{statValue(summary?.lots.withSpecification)}</Text><Text fontSize="sm" color="neutral.500">{t("dashboard.activeLots")}</Text></Box>
                            <Box textAlign="right"><Text fontSize="2xl" fontWeight="bold" color="neutral.800">{statValue(summary?.lots.withoutSpecification)}</Text><Text fontSize="sm" color="neutral.500">{t("dashboard.lotsWithoutSpecification")}</Text></Box>
                        </HStack>
                    </Box>
                    <Box bg="primary.700" color="white" borderRadius="xl" p={5}>
                        <Text fontWeight="semibold">{t("dashboard.quickActions")}</Text>
                        <Text mt={1} fontSize="sm" color="primary.100">{t("dashboard.quickActionsDescription")}</Text>
                        <VStack mt={4} align="stretch" gap={2}>
                            {[{ label: t("dashboard.manageUsers"), to: "/users" }, { label: t("dashboard.manageProviders"), to: "/providers" }, { label: t("dashboard.browseProducts"), to: "/products" }].map(action => (
                                <HStack asChild key={action.to} justify="space-between" px={3} py={2} borderRadius="md" bg="whiteAlpha.200" _hover={{ bg: "whiteAlpha.300" }}>
                                    <RouterLink to={action.to}><Text fontSize="sm" fontWeight="medium">{action.label}</Text><FiChevronRight /></RouterLink>
                                </HStack>
                            ))}
                        </VStack>
                    </Box>
                </VStack>
            </Grid>
        </VStack>
    )
}

export default AdminDashboard
