

import { lotApi } from "@/api/lot.api"
import { productApi } from "@/api/product.api"
import { providerApi } from "@/api/provider.api"
import { userApi } from "@/api/user.api"
import type { Lot } from "@/shared/types/lot.types"
import type { Product } from "@/shared/types/product.types"
import type { Provider } from "@/shared/types/provider.types"
import type { User } from "@/shared/types/user.type"
import { useI18n } from "@/shared/i18n/useI18n"
import { Box, Flex, Grid, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { FiBox, FiBriefcase, FiChevronRight, FiPackage, FiUsers } from "react-icons/fi"
import { Link as RouterLink } from "react-router-dom"
import DashboardStatCard from "./DashboardStatCard"

const AdminDashboard = () => {
    const { language, t } = useI18n()
    const usersQuery = useQuery<User[]>({ queryKey: ["users"], queryFn: userApi.getAll })
    const providersQuery = useQuery<Provider[]>({ queryKey: ["providers"], queryFn: providerApi.getAll })
    const lotsQuery = useQuery<Lot[]>({ queryKey: ["lots"], queryFn: lotApi.getAll })
    const productsQuery = useQuery<Product[]>({ queryKey: ["products"], queryFn: productApi.getAll })

    const users = usersQuery.data ?? []
    const lots = lotsQuery.data ?? []
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)
    const activeLots = lots.filter(lot => lot.specificationsId).length
    const isLoading = [usersQuery, providersQuery, lotsQuery, productsQuery].some(query => query.isLoading)

    return (
        <VStack align="stretch" gap={7}>
            <Flex align={{ base: "start", sm: "center" }} justify="space-between" gap={4} direction={{ base: "column", sm: "row" }}>
                <Box>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="neutral.900">{t("dashboard.adminTitle")}</Text>
                    <Text mt={1} color="neutral.500">{t("dashboard.adminDescription")}</Text>
                </Box>
                <Text px={3} py={1.5} bg="primary.50" borderRadius="full" color="primary.700" fontSize="sm" fontWeight="medium">{t("dashboard.administrator")}</Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap={4}>
                <DashboardStatCard label={t("users")} value={usersQuery.data?.length ?? "—"} icon={<FiUsers />} accent="primary" />
                <DashboardStatCard label={t("providers")} value={providersQuery.data?.length ?? "—"} icon={<FiBriefcase />} accent="secondary" />
                <DashboardStatCard label={t("lots")} value={lotsQuery.data?.length ?? "—"} icon={<FiBox />} accent="accent" />
                <DashboardStatCard label={t("products")} value={productsQuery.data?.length ?? "—"} icon={<FiPackage />} accent="success" />
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

                    {isLoading ? (
                        <Flex minH="140px" align="center" justify="center"><Spinner color="primary.500" /></Flex>
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
                            <Box><Text fontSize="2xl" fontWeight="bold" color="success.600">{lotsQuery.data ? activeLots : "—"}</Text><Text fontSize="sm" color="neutral.500">{t("dashboard.activeLots")}</Text></Box>
                            <Box textAlign="right"><Text fontSize="2xl" fontWeight="bold" color="neutral.800">{lotsQuery.data ? lots.length - activeLots : "—"}</Text><Text fontSize="sm" color="neutral.500">{t("dashboard.lotsWithoutSpecification")}</Text></Box>
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
