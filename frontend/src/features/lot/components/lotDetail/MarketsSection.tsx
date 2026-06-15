import Badge from "@/shared/components/atoms/badge"
import Button from "@/shared/components/atoms/button"
import type { Lot } from "@/shared/types/lot.types"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { FiArrowUpRight, FiChevronRight, FiClipboard, FiPlus } from "react-icons/fi"
import { DetailSection } from "./lot-detail.components"
import { formatShortDate } from "./lot-detail.types"

type Props = {
    lot: Lot
    marketCount: number
}

const MarketsSection = ({ lot, marketCount }: Props) => (
    <DetailSection
        title="Marches lies"
        icon={<FiClipboard />}
        action={(
            <Box w="44">
                <Button type="button" variant="secondary" size="sm">
                    <HStack justify="center" gap={1}><FiPlus /><Text>Nouveau marche</Text><FiArrowUpRight /></HStack>
                </Button>
            </Box>
        )}
    >
        <Flex align="center" gap={3} bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" px={4} py={3} minH="16">
            <Flex w="9" h="9" align="center" justify="center" bg="success.50" color="success.700" borderRadius="md" flexShrink={0}>
                <FiClipboard />
            </Flex>
            <Box minW="0" flex="1">
                <Text fontSize="sm" fontWeight="bold" color="neutral.900">
                    {marketCount
                        ? `M-${new Date(lot.createdAt).getFullYear()}-${String(lot.id).padStart(3, "0")}`
                        : "Aucun marche lie"}
                </Text>
                <Text fontSize="xs" color="neutral.700" mt={1}>
                    {lot.designation?.name ?? "Designation"} — {formatShortDate(lot.createdAt)}
                </Text>
            </Box>
            {marketCount > 0 && <Badge label="Approuve" variant="success" tone="subtle" size="sm" />}
            <Box w="10" flexShrink={0}>
                <Button type="button" variant="ghost" size="sm" aria-label="Voir le marche" title="Voir le marche">
                    <FiChevronRight />
                </Button>
            </Box>
        </Flex>
    </DetailSection>
)

export default MarketsSection