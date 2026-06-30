import type { Lot } from "@/shared/types/lot.types"
import { Box, SimpleGrid, Text } from "@chakra-ui/react"
import type { UseFormRegister } from "react-hook-form"
import type { SpecificationForm } from "./types"

type LotCheckboxGridProps = {
    lots: Lot[]
    register: UseFormRegister<SpecificationForm>
}

const LotCheckboxGrid = ({ lots, register }: LotCheckboxGridProps) => (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
        {lots.length > 0 ? lots.map(lot => (
            <Box
                key={lot.id}
                as="label"
                display="flex"
                alignItems="center"
                gap={3}
                p={3}
                border="1px solid"
                borderColor="neutral.200"
                borderRadius="md"
                cursor="pointer"
            >
                <input type="checkbox" value={lot.id} {...register("lotIds")} />
                <Box>
                    <Text fontSize="sm" fontWeight="medium" color="neutral.800">{lot.name}</Text>
                    <Text fontSize="xs" color="neutral.500">{lot.products?.length ?? 0} products</Text>
                </Box>
            </Box>
        )) : (
            <Box p={4} bg="neutral.50" borderRadius="md">
                <Text fontSize="sm" color="neutral.500">Select a designation with available lots.</Text>
            </Box>
        )}
    </SimpleGrid>
)

export default LotCheckboxGrid
