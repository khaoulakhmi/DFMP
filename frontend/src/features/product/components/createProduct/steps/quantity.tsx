import { Separator, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import TextField from "@/shared/components/molecules/Forms/textField"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { ProductForm } from "../types"

interface QuantityStepProps {
    register: UseFormRegister<ProductForm>
    errors: FieldErrors<ProductForm>
    unit: string
}

const required = (label: string) => `${label} is required`

const Quantity = ({ register, errors, unit }: QuantityStepProps) => {
    return (
        <VStack gap={4} align="stretch">
            <Text
                fontWeight="medium"
                fontSize="sm"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="wider"
            >
                Quantities
            </Text>

            <Separator />

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <TextField
                    label={`Quantity min (${unit || "unit"})`}
                    type="number"
                    error={errors.quantityMin?.message}
                    required
                    showRequiredIndicator
                    {...register("quantityMin", {
                        required: required("Quantity min"),
                        valueAsNumber: true,
                        min: { value: 0, message: "Must be >= 0" },
                    })}
                />
                <TextField
                    label={`Quantity max (${unit || "unit"})`}
                    type="number"
                    error={errors.quantityMax?.message}
                    required
                    showRequiredIndicator
                    {...register("quantityMax", {
                        required: required("Quantity max"),
                        valueAsNumber: true,
                        min: { value: 0, message: "Must be >= 0" },
                        validate: (value, formValues) =>
                            Number(value) >= Number(formValues.quantityMin) ||
                            "Quantity max must be greater than min",
                    })}
                />
            </SimpleGrid>
        </VStack>
    )
}


export default Quantity
