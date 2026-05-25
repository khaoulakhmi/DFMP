import { Box, Text } from "@chakra-ui/react"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import Typography from "@/shared/components/atoms/typography"
import ProductList from "./components/ProductList"

const Product = () => {
    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Products", isCurrentPage: true },
                ]}
            />

            <Typography variant="heading">
                Products
            </Typography>
            <Text fontSize="sm" color="neutral.600" mt={1}>
                Manage catalog products.
            </Text>
            <Box mt={5}>
                <ProductList />
            </Box>
        </Box>
    )
}

export default Product
