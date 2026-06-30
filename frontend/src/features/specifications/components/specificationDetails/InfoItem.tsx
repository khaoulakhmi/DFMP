import { Box, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"

type InfoItemProps = {
    label: string
    value: ReactNode
}

const InfoItem = ({ label, value }: InfoItemProps) => (
    <Box>
        <Text fontSize="xs" color="neutral.500" mb={1}>{label}</Text>
        <Text fontSize="sm" fontWeight="semibold" color="neutral.900">{value}</Text>
    </Box>
)

export default InfoItem
