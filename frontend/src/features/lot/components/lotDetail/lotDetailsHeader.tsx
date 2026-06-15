import Button from "@/shared/components/atoms/button"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import type { Lot } from "@/shared/types/lot.types"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { FiBox, FiEdit2, FiPlus } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { formatDate } from "./lot-detail.types"

type Props = {
    lot: Lot
}

const LotDetailHeader = ({ lot }: Props) => {
    const navigate = useNavigate()
    const createdAt = formatDate(lot.createdAt)

    return (
        <>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Lots", href: "/lots" },
                    { label: lot.name, isCurrentPage: true },
                ]}
            />

            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                gap={4}
                mb={6}
            >
                <HStack gap={4} align="center">
                    <Flex
                        w="12" h="12"
                        align="center" justify="center"
                        bg="secondary.50" color="secondary.700"
                        borderRadius="lg" flexShrink={0}
                    >
                        <FiBox size={22} />
                    </Flex>
                    <Box minW="0">
                        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="neutral.900" lineHeight="1.2">
                            {lot.name}
                        </Text>
                        <Text fontSize="sm" color="neutral.700" mt={1}>
                            {lot.designation?.name ?? `Designation ${lot.designationId}`} — Cree le {createdAt}
                        </Text>
                    </Box>
                </HStack>

                <Flex gap={3} align="stretch" direction={{ base: "column", sm: "row" }}>
                    <Box w={{ base: "full", sm: "36" }}>
                        <Button type="button" variant="secondary" onClick={() => navigate("/designations")}>
                            <HStack justify="center" gap={2}><FiEdit2 /><Text>Modifier</Text></HStack>
                        </Button>
                    </Box>
                    <Box w={{ base: "full", sm: "44" }}>
                        <Button type="button" variant="secondary" onClick={() => navigate(`/product/create?lotId=${lot.id}`)}>
                            <HStack justify="center" gap={2}><FiPlus /><Text>Ajouter produit</Text></HStack>
                        </Button>
                    </Box>
                </Flex>
            </Flex>
        </>
    )
}

export default LotDetailHeader