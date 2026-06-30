import { Box, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"

type CreateSpecificationSectionProps = {
    title: string
    description: string
    children: ReactNode
}

const CreateSpecificationSection = ({ title, description, children }: CreateSpecificationSectionProps) => (
    <Box>
        <Box mb={4}>
            <Text fontSize="sm" fontWeight="semibold" color="neutral.900">{title}</Text>
            <Text fontSize="xs" color="neutral.500" mt={1}>{description}</Text>
        </Box>
        {children}
    </Box>
)

export default CreateSpecificationSection
