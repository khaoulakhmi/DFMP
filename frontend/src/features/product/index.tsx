import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
// import Typography from "@/shared/components/atoms/typography"
import Button from "@/shared/components/atoms/button"
import ProductList from "./components/ProductList"
import { useNavigate } from "react-router-dom"
import { FiPlus } from "react-icons/fi"
import { useI18n } from "@/shared/i18n/useI18n"


const Product = () => {
    const { t } = useI18n()
    const navigate = useNavigate()
    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: t("dashboard"), href: "/" },
                    { label: t("products"), isCurrentPage: true },
                ]}
            />

            <Flex
                justify="space-between"
                align={{ base: "stretch", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={3}
            >
                <Box>
                    <Text fontSize="lg" fontWeight="semibold" color="neutral.900">{t("products.title")}</Text>
                    <Text fontSize="sm" color="neutral.500">{t("products.description")}</Text>
                </Box>
                <Box w={{ base: "full", sm: "44" }}>
                    <Button onClick={() => navigate("/product/create")}>
                        <HStack justify="center" gap={2}><FiPlus /><Text>{t("products.add")}</Text></HStack>
                    </Button>
                </Box>
            </Flex>
            <Box mt={5}>
                <ProductList />
            </Box>
        </Box>
    )
}

export default Product
