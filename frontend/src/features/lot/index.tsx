import { Box, HStack, Text, Flex } from "@chakra-ui/react"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
// import Typography from "@/shared/components/atoms/typography"
import LotList from "./components/LotList"
import { FiPlus } from "react-icons/fi"
import Button from "@/shared/components/atoms/button"
import { useState } from "react"
import CreateLotModal from "./components/createLotModal"
import { useQuery } from "@tanstack/react-query"
import type { Designation } from "@/shared/types/designation.types"
import { designationApi } from "@/api/designation.api"

const Lot = () => {

    const [createLotOpen, SetCreateLotOpen] = useState(false)
    const {data: designations = [] as Designation[], isLoading, isError} = useQuery({
        queryKey: ["designations"],
        queryFn: designationApi.getAll,
    })
    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Lots", isCurrentPage: true },
                ]}
            />

            <Flex
                justify="space-between"
                align={{ base: "stretch", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={3}
            >
                <Box>
                    <Text fontSize="lg" fontWeight="semibold" color="neutral.900">Lots</Text>
                    <Text fontSize="sm" color="neutral.500">Browse catalog lots.</Text>
                </Box>
                <Box w={{ base: "full", sm: "44" }}>
                    <Button onClick={() => SetCreateLotOpen(true)} w="full" colorScheme="blue">
                        <HStack justify="center" gap={2}><FiPlus /><Text>Add Lot</Text></HStack>
                    </Button>
                </Box>
            </Flex>
            <Box mt={5}>
                <LotList />
            </Box>
            <CreateLotModal open={createLotOpen} onClose={() => SetCreateLotOpen(false)} designations={designations} />
        </Box>
    )
}

export default Lot
