import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { Box } from "@chakra-ui/react"
import { Outlet, useLocation } from "react-router-dom"
import DesignationExplorer from "./components/designationExplorer"

const Designation = () => {
    const location = useLocation()
    const isEditPage = location.pathname.includes("/edit")

    const items = [
        { label: "Dashboard", href: "/" },
        { label: "Designations", isCurrentPage: true },
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
            <BreadcrumbNavigation mb={4} items={items} separator=">" />
            <DesignationExplorer />
        </Box>
    )
}

export default Designation
