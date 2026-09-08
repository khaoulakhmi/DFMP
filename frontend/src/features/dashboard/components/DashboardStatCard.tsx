import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import type { ReactNode } from "react"

type DashboardStatCardProps = {
    label: string
    value: string | number
    icon: ReactNode
    accent: "primary" | "secondary" | "accent" | "success"
}

const DashboardStatCard = ({ label, value, icon, accent }: DashboardStatCardProps) => (
    <HStack
        align="start"
        gap={4}
        p={5}
        bg="white"
        borderWidth="1px"
        borderColor="neutral.200"
        borderRadius="xl"
        boxShadow="sm"
    >
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxSize="11"
            borderRadius="lg"
            bg={`${accent}.100`}
            color={`${accent}.700`}
            fontSize="xl"
        >
            {icon}
        </Box>
        <VStack align="start" gap={0}>
            <Text color="neutral.500" fontSize="sm">{label}</Text>
            <Text color="neutral.900" fontSize="2xl" fontWeight="bold">{value}</Text>
        </VStack>
    </HStack>
)

export default DashboardStatCard
