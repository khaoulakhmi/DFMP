import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { Box } from "@chakra-ui/react"
import { Outlet, useLocation } from "react-router-dom"
import DesignationExplorer from "./components/designationExplorer"
import { useI18n } from "@/shared/i18n/useI18n"

const Designation = () => {
    const location = useLocation()
    const isEditPage = location.pathname.includes("/edit")
    const { t } = useI18n()

    const items = [
        { label: t("dashboard"), href: "/" },
        { label: t("designations"), isCurrentPage: true },
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
