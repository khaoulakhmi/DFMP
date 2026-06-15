import Button from "@/shared/components/atoms/button"
import type { Lot } from "@/shared/types/lot.types"
import { Box, Flex, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import {
    FiArrowUpRight,
    FiCalendar,
    FiCheck,
    FiClipboard,
    FiFileText,
} from "react-icons/fi"
import { DetailSection, SpecInfo } from "./lot-detail.components"
import { formatDate, formatShortDate, formatMoney, type SpecificationDetails } from "./lot-detail.types"

type TimelineItemProps = {
    label: string
    date: string
    status?: "done" | "current" | "pending"
}

const TimelineItem = ({ label, date, status = "done" }: TimelineItemProps) => {
    const styles = {
        done: { bg: "success.50", color: "success.700", icon: <FiCheck /> },
        current: { bg: "secondary.50", color: "secondary.700", icon: <FiCalendar /> },
        pending: { bg: "neutral.100", color: "neutral.500", icon: <FiClipboard /> },
    }[status]

    return (
        <VStack gap={2} minW={{ base: "28", md: "24" }} flex="1">
            <Flex
                w="8" h="8"
                align="center" justify="center"
                bg={styles.bg} color={styles.color}
                borderRadius="full" fontSize="sm"
            >
                {styles.icon}
            </Flex>
            <Box textAlign="center">
                <Text fontSize="xs" fontWeight="bold" color="neutral.700" lineHeight="1.2">
                    {label}
                </Text>
                <Text fontSize="xs" color="neutral.600" mt={1}>
                    {date}
                </Text>
            </Box>
        </VStack>
    )
}

type Props = {
    lot: Lot
    spec: SpecificationDetails | null | undefined
}

const SpecificationSection = ({ lot, spec }: Props) => {
    const timeline = [
        { label: "Depot C.M.", date: formatShortDate(spec?.depositDateCM ?? lot.createdAt), status: "done" as const },
        { label: "Seance",     date: formatShortDate(spec?.sessionDate),                    status: "done" as const },
        { label: "Visa",       date: formatShortDate(spec?.visaDate),                       status: "done" as const },
        { label: "Ouverture",  date: formatShortDate(spec?.openingDate),                    status: "done" as const },
        { label: "Attribution",date: "En cours",                                            status: "current" as const },
        { label: "A.V.S.",     date: "-",                                                   status: "pending" as const },
    ]

    return (
        <DetailSection
            title="Cahier de charge"
            icon={<FiFileText />}
            action={(
                <Box w="36">
                    <Button type="button" variant="secondary" size="sm">
                        <HStack justify="center" gap={1}><Text>Voir details</Text><FiArrowUpRight /></HStack>
                    </Button>
                </Box>
            )}
        >
            <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" overflow="hidden">
                <SimpleGrid columns={{ base: 1, md: 4 }} borderBottom="1px solid" borderColor="neutral.200">
                    <Box p={4} borderEnd={{ md: "1px solid" }} borderColor="neutral.200">
                        <SpecInfo label="Type" value={spec?.type ?? "Appel d'offres"} />
                        <SpecInfo
                            label="N° Visa"
                            value={spec?.visaNumber ?? (spec ? `VIS-${spec.year}-${String(spec.id).padStart(3, "0")}` : "-")}
                        />
                    </Box>
                    <Box p={4} borderEnd={{ md: "1px solid" }} borderColor="neutral.200">
                        <SpecInfo label="Annee" value={String(spec?.year ?? new Date(lot.createdAt).getFullYear())} />
                        <SpecInfo label="Date visa" value={formatDate(spec?.visaDate)} />
                    </Box>
                    <Box p={4} borderEnd={{ md: "1px solid" }} borderColor="neutral.200">
                        <SpecInfo label="Montant min" value={formatMoney(spec?.minAmount)} />
                    </Box>
                    <Box p={4}>
                        <SpecInfo label="Montant max" value={formatMoney(spec?.maxAmount)} />
                    </Box>
                </SimpleGrid>

                <Box p={4}>
                    <Text fontSize="xs" color="neutral.700" mb={4}>Progression de l'appel d'offres</Text>
                    <Flex align="flex-start" gap={{ base: 2, md: 4 }} overflowX="auto" pb={1}>
                        {timeline.map((step, index) => (
                            <HStack key={step.label} align="flex-start" gap={{ base: 2, md: 4 }} flex="1">
                                <TimelineItem {...step} />
                                {index < timeline.length - 1 && (
                                    <Box h="1px" bg="neutral.300" flex="1" minW="8" mt="4" />
                                )}
                            </HStack>
                        ))}
                    </Flex>
                </Box>
            </Box>
        </DetailSection>
    )
}

export default SpecificationSection