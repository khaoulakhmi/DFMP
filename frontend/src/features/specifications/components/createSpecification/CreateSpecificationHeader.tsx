import Button from "@/shared/components/atoms/button"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { FiArrowLeft } from "react-icons/fi"

type CreateSpecificationHeaderProps = {
    onBack: () => void
}

const CreateSpecificationHeader = ({ onBack }: CreateSpecificationHeaderProps) => (
    <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} mb={5}>
        <Box>
            <Text fontSize="lg" fontWeight="semibold" color="neutral.900">Nouveau cahier de charge</Text>
            <Text fontSize="sm" color="neutral.500">Renseignez les montants, visas, publications et etapes d'appel d'offres.</Text>
        </Box>
        <Box w={{ base: "full", sm: "36" }}>
            <Button type="button" variant="secondary" onClick={onBack}>
                <HStack justify="center"><FiArrowLeft /><Text>Back</Text></HStack>
            </Button>
        </Box>
    </Flex>
)

export default CreateSpecificationHeader
