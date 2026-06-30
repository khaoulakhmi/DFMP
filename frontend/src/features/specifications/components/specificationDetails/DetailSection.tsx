import { Box, HStack, Text } from "@chakra-ui/react"
import type { ReactElement, ReactNode } from "react"

type DetailSectionProps = {
    title: string
    icon: ReactElement
    children: ReactNode
}

const DetailSection = ({ title, icon, children }: DetailSectionProps) => (
    <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="xl" overflow="hidden" boxShadow="sm">
        <HStack gap={2} px={5} py={4} bg="neutral.50" borderBottom="1px solid" borderColor="neutral.200">
            <Box color="primary.600">{icon}</Box>
            <Text fontSize="sm" fontWeight="semibold" color="neutral.800">{title}</Text>
        </HStack>
        <Box p={5}>{children}</Box>
    </Box>
)

export default DetailSection
