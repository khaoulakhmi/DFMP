import { Box, Separator, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import TextField from "@/shared/components/molecules/Forms/textField"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import type { UseFormRegister, FieldErrors } from "react-hook-form"
import type { ProductForm } from "../types"
import type { Designation } from "@/shared/types/designation.types"

interface GeneralStepProps {
    register: UseFormRegister<ProductForm>
    errors: FieldErrors<ProductForm>
    designations: Designation[]
    unitOptions: string[]
}

const required = (label: string) => `${label} is required`

const GeneralStep = ({
    register,
    errors,
    designations,
    unitOptions,
}: GeneralStepProps) => {
    return (
        <VStack gap={4} align="stretch">
            <Text
                fontWeight="medium"
                fontSize="sm"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="wider"
            >
                General
            </Text>

            <Separator />

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <TextField
                    label="Product name"
                    error={errors.name?.message}
                    required
                    showRequiredIndicator
                    {...register("name", {
                        required: required("Product name"),
                    })}
                />

                <SelectField
                    label="Unit"
                    error={errors.unit?.message}
                    required
                    showRequiredIndicator
                    {...register("unit", {
                        required: required("Unit"),
                    })}
                >
                    {unitOptions.map((u) => (
                        <option key={u} value={u}>
                            {u}
                        </option>
                    ))}
                </SelectField>
            </SimpleGrid>

            <SelectField
                label="Designation"
                error={errors.designationId?.message}
                required
                showRequiredIndicator
                {...register("designationId", {
                    required: required("Designation"),
                })}
            >
                <option value="">Select designation</option>

                {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                ))}
            </SelectField>

            <Box
                px={3}
                py={2}
                bg="blue.50"
                borderRadius="md"
                borderLeft="3px solid"
                borderColor="blue.400"
            >
                <Text fontSize="xs" color="blue.700">
                    The lot will be assigned after creation.
                </Text>
            </Box>
        </VStack>
    )
}

export default GeneralStep