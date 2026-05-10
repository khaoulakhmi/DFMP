import Tabs from "@/shared/components/molecules/tabs"
import CreateProviderPage from "@/features/provider/components/createProviderPage"
import ProviderList from "@/features/provider/components/providerList"
import { Box } from "@chakra-ui/react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

const Provider = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isEditPage = location.pathname.includes("/edit")
    const activeTab = location.pathname.endsWith("/create") ? "create" : "list"

    if (isEditPage) {
        return (
            <Box p={{ base: 4, md: 6 }}>
                <Outlet />
            </Box>
        )
    }

    return (
        <Box p={{ base: 4, md: 6 }}>

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
