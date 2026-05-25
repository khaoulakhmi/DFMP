import { Box, Text } from "@chakra-ui/react"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import Typography from "@/shared/components/atoms/typography"
import LotList from "./components/LotList"

const Lot = () => {
    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Lots", isCurrentPage: true },
                ]}
            />

            <Typography variant="heading">
                Lots
            </Typography>
            <Text fontSize="sm" color="neutral.600" mt={1}>
                Manage product lots.
            </Text>
            <Box mt={5}>
                <LotList />
            </Box>
        </Box>
    )
}

export default Lot
