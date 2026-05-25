import Tabs from "@/shared/components/molecules/tabs"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import CreateProviderPage from "@/features/provider/components/createProviderPage"
import ProviderList from "@/features/provider/components/providerList"
import { Box } from "@chakra-ui/react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

const Provider = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isEditPage = location.pathname.includes("/edit")
    const activeTab = location.pathname.endsWith("/create") ? "create" : "list"
    const breadcrumbItems =
        activeTab === "create"
            ? [
                { label: "Dashboard", href: "/" },
                { label: "Providers", href: "/providers" },
                { label: "Add Provider", isCurrentPage: true },
            ]
            : [
                { label: "Dashboard", href: "/" },
                { label: "Providers", isCurrentPage: true },
            ]

    if (isEditPage) {
        return (
            <Box p={{ base: 4, md: 6 }}>
                <Outlet />
            </Box>
        )
    }

    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation
                mb={4}
                items={breadcrumbItems}
            />

            <Tabs
                variant="underline"
                value={activeTab}
                onValueChange={(details) => {
                    navigate(details.value === "create" ? "/providers/create" : "/providers")
                }}
                options={[
                    {
                        label: "Provider List",
                        value: "list",
                        content: <ProviderList />,
                    },
                    {
                        label: "Add Provider",
                        value: "create",
                        content: <CreateProviderPage />,
                    },
                ]}
            />
        </Box>
    )
}

export default Provider
