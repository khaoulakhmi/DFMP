import { Box, Flex, HStack, Text } from "@chakra-ui/react"

export const DetailSection = ({
    title,
    icon,
    action,
    children,
}: {
    title: string
    icon: React.ReactNode
    action?: React.ReactNode
    children: React.ReactNode
}) => (
    <Box>
        <Flex align="center" justify="space-between" gap={3} mb={3}>
            <HStack gap={2} color="neutral.700">
                <Box fontSize="sm">{icon}</Box>
                <Text fontSize="sm" fontWeight="bold" letterSpacing="0" textTransform="uppercase">
                    {title}
                </Text>
            </HStack>
            {action}
        </Flex>
        {children}
    </Box>
)

export const MetricCard = ({
    icon,
    label,
    value,
    helper,
}: {
    icon: React.ReactNode
    label: string
    value: string
    helper: string
}) => (
    <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4} minH="28">
        <HStack gap={2} color="neutral.600" mb={2}>
            <Box fontSize="sm">{icon}</Box>
            <Text fontSize="xs" fontWeight="medium">{label}</Text>
        </HStack>
        <Text fontSize="2xl" fontWeight="bold" color="neutral.900" lineHeight="1">
            {value}
        </Text>
        <Text
            fontSize="xs"
            color={helper === "Approuve" ? "success.700" : "neutral.700"}
            fontWeight={helper === "Approuve" ? "semibold" : "medium"}
            mt={2}
        >
            {helper}
        </Text>
    </Box>
)

export const SpecInfo = ({ label, value }: { label: string; value: string }) => (
    <Box minH="16">
        <Text fontSize="xs" color="neutral.600" fontWeight="medium">
            {label}
        </Text>
        <Text fontSize="sm" color="neutral.900" fontWeight="bold" mt={1}>
            {value}
        </Text>
    </Box>
)