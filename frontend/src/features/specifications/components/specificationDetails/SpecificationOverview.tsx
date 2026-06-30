import type { Specification } from "@/shared/types/specification.types"
import { Box, Flex, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { FiCalendar, FiCheckCircle, FiFileText, FiGrid, FiLayers } from "react-icons/fi"
import { formatDate, formatMoney } from "../specification.utils"
import DetailSection from "./DetailSection"
import InfoItem from "./InfoItem"
import TimelineItem from "./TimelineItem"

type SpecificationOverviewProps = {
    specification: Specification
}

const SpecificationOverview = ({ specification }: SpecificationOverviewProps) => {
    const tendering = specification.tendering
    const timeline = [
        ["Depot C.M.", specification.depositDateCM],
        ["Seance", specification.sessionDate],
        ["Visa", specification.visaDate],
        ["Ouverture", tendering?.openingDate],
        ["Evaluation technique", tendering?.techEvalDate],
        ["Evaluation financiere", tendering?.finEvalDate],
        ["Attribution", tendering?.attributionDate],
        ["Recours", tendering?.appealDate],
        ["Programmation", tendering?.programmingDate],
    ] as const

    return (
        <>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap={3} mb={5}>
                <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4}>
                    <InfoItem label="Montant min" value={formatMoney(specification.minAmount)} />
                </Box>
                <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4}>
                    <InfoItem label="Montant max" value={formatMoney(specification.maxAmount)} />
                </Box>
                <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4}>
                    <InfoItem label="No Visa" value={specification.visaNumber ?? "-"} />
                </Box>
                <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4}>
                    <InfoItem label="Lots" value={`${specification.lots?.length ?? 0} associes`} />
                </Box>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                <DetailSection title="Chronologie administrative" icon={<FiCalendar />}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                        {timeline.map(([label, value]) => (
                            <TimelineItem key={label} label={label} value={value} done={Boolean(value)} />
                        ))}
                    </SimpleGrid>
                </DetailSection>

                <DetailSection title="Publicite" icon={<FiFileText />}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <InfoItem label="Publication arabe" value={formatDate(specification.pubArabicDate)} />
                        <InfoItem label="Journal arabe" value={specification.pubArabicJournal ?? "-"} />
                        <InfoItem label="Publication francaise" value={formatDate(specification.pubFrenchDate)} />
                        <InfoItem label="Journal francais" value={specification.pubFrenchJournal ?? "-"} />
                        <InfoItem label="Journal electronique arabe" value={specification.pubArElecJournal ?? "-"} />
                        <InfoItem label="Journal electronique francais" value={specification.pubFrElecJournal ?? "-"} />
                    </SimpleGrid>
                </DetailSection>

                <DetailSection title="Evaluation, attribution et recours" icon={<FiCheckCircle />}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <InfoItem label="Date ouverture" value={formatDate(tendering?.openingDate)} />
                        <InfoItem label="Evaluation technique" value={formatDate(tendering?.techEvalDate)} />
                        <InfoItem label="Evaluation financiere" value={formatDate(tendering?.finEvalDate)} />
                        <InfoItem label="Attribution" value={formatDate(tendering?.attributionDate)} />
                        <InfoItem label="Delai recours" value={`${tendering?.delayPeriodDays ?? 10} jours`} />
                        <InfoItem label="Date recours" value={formatDate(tendering?.appealDate)} />
                        <InfoItem label="Depot recours" value={formatDate(tendering?.appealDepositDate)} />
                        <InfoItem label="Resultat recours" value={tendering?.appealResult ?? "-"} />
                        <InfoItem label="Programmation" value={formatDate(tendering?.programmingDate)} />
                        <InfoItem label="A.V.S." value={tendering?.avsStatus ? tendering.avsStatus.replace("_", " ") : "-"} />
                    </SimpleGrid>
                </DetailSection>

                <DetailSection title="Lots associes" icon={<FiLayers />}>
                    <VStack align="stretch" gap={3}>
                        {specification.lots?.length ? specification.lots.map(lot => (
                            <Box key={lot.id} border="1px solid" borderColor="neutral.200" borderRadius="md" p={4}>
                                <Flex justify="space-between" gap={3} align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }}>
                                    <Box>
                                        <Text
                                            asChild
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="neutral.900"
                                            _hover={{ color: "primary.600" }}
                                        >
                                            <RouterLink to={`/lots/${lot.id}`}>{lot.name}</RouterLink>
                                        </Text>
                                        <Text fontSize="xs" color="neutral.500">{lot.products?.length ?? 0} products</Text>
                                    </Box>
                                    <HStack color="primary.700" fontSize="sm">
                                        <FiGrid />
                                        <Text>{lot.designation?.name ?? specification.designation?.name}</Text>
                                    </HStack>
                                </Flex>
                            </Box>
                        )) : (
                            <Text fontSize="sm" color="neutral.500">Aucun lot associe.</Text>
                        )}
                    </VStack>
                </DetailSection>
            </SimpleGrid>
        </>
    )
}

export default SpecificationOverview
