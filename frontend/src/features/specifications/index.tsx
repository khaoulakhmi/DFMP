import Button from "@/shared/components/atoms/button"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import SpecificationList from "./components/SpecificationList"

const Specifications = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isNestedPage = location.pathname !== "/specifications"

    if (isNestedPage) {
        return <Outlet />
    }

    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Specifications", isCurrentPage: true },
                ]}
            />

            <Flex
                justify="space-between"
                align={{ base: "stretch", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={3}
                mb={5}
            >
                <Box>
                    <Text fontSize="lg" fontWeight="semibold" color="neutral.900">Cahiers de charge</Text>
                    <Text fontSize="sm" color="neutral.500">Suivi des specifications, visas, publications et appels d'offres.</Text>
                </Box>
                <Box w={{ base: "full", sm: "56" }}>
                    <Button onClick={() => navigate("/specifications/create")}>
                        <HStack justify="center" gap={2}><FiPlus /><Text>Add specification</Text></HStack>
                    </Button>
                </Box>
            </Flex>

            <SpecificationList />
        </Box>
    )
}

export default Specifications
