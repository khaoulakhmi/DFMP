import Badge from "@/shared/components/atoms/badge"
import Button from "@/shared/components/atoms/button"
import type { Specification } from "@/shared/types/specification.types"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { FiArrowLeft, FiEdit2, FiFileText } from "react-icons/fi"

type SpecificationDetailHeaderProps = {
    isEditing: boolean
    specification: Specification
    onBack: () => void
    onEdit: () => void
}

const SpecificationDetailHeader = ({ isEditing, specification, onBack, onEdit }: SpecificationDetailHeaderProps) => (
    <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} mb={5}>
        <HStack gap={4} align="flex-start">
            <Flex w="12" h="12" align="center" justify="center" bg="primary.50" color="primary.700" borderRadius="md">
                <FiFileText size={24} />
            </Flex>
            <Box>
                <HStack gap={2} wrap="wrap">
                    <Text fontSize="lg" fontWeight="bold" color="neutral.900">{specification.type}</Text>
                    <Badge label={String(specification.year)} variant="accent" tone="subtle" />
                </HStack>
                <Text fontSize="sm" color="neutral.600">
                    {specification.designation?.name ?? `Designation ${specification.designationId}`}
                </Text>
            </Box>
        </HStack>
        <HStack gap={3} justify={{ base: "stretch", sm: "flex-end" }} wrap="wrap">
            <Box w={{ base: "full", sm: "36" }}>
                <Button type="button" variant="secondary" onClick={onBack}>
                    <HStack justify="center"><FiArrowLeft /><Text>Back</Text></HStack>
                </Button>
            </Box>
            {!isEditing && (
                <Box w={{ base: "full", sm: "36" }}>
                    <Button type="button" onClick={onEdit}>
                        <HStack justify="center"><FiEdit2 /><Text>Edit</Text></HStack>
                    </Button>
                </Box>
            )}
        </HStack>
    </Flex>
)

export default SpecificationDetailHeader
