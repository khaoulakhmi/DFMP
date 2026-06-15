import { HStack, Separator, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import TextField from "@/shared/components/molecules/Forms/textField"
import { TVA } from "@/shared/types/product.types"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { ProductForm } from "../types"

interface PricingStepProps {
    register: UseFormRegister<ProductForm>
    errors: FieldErrors<ProductForm>
    priceTtc: number
    margin: number | null
    unit: string
}

const required = (label: string) => `${label} is required`

const Pricing = ({
    register,
    errors,
    priceTtc,
    margin,
    unit,
}: PricingStepProps) => {
    return (
        <VStack gap={4} align="stretch">
            <Text
                fontWeight="medium"
                fontSize="sm"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="wider"
            >
                Pricing
            </Text>

            <Separator />

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <TextField
                    label="Unit price (DA)"
                    type="number"
                    error={errors.unitPrice?.message}
                    required
                    showRequiredIndicator
                    {...register("unitPrice", {
                        required: required("Unit price"),
                        valueAsNumber: true,
                        min: { value: 0, message: "Must be >= 0" },
                    })}
                />
                <TextField
                    label="Provider price (DA)"
                    type="number"
                    error={errors.providerPrice?.message}
                    {...register("providerPrice", {
                        valueAsNumber: true,
                        min: { value: 0, message: "Must be >= 0" },
                    })}
                />
                <TextField
                    label="Evaluation price (DA)"
                    type="number"
                    error={errors.evaluationPrice?.message}
                    {...register("evaluationPrice", {
                        valueAsNumber: true,
                        min: { value: 0, message: "Must be >= 0" },
                    })}
                />
            </SimpleGrid>

            <SelectField
                label="TVA"
                error={errors.tva?.message}
                required
                showRequiredIndicator
                {...register("tva", { required: required("TVA") })}
            >
                <option value={TVA.ZERO}>0%</option>
                <option value={TVA.NINE}>9%</option>
                <option value={TVA.NINETEEN}>19%</option>
            </SelectField>

            <HStack
                px={4}
                py={3}
                bg="neutral.50"
                borderRadius="md"
                justify="space-between"
                wrap="wrap"
                gap={2}
            >
                <Text fontSize="sm">
                    <Text as="span" color="text.secondary">Price TTC: </Text>
                    <Text as="span" fontWeight="semibold">{priceTtc.toFixed(2)} DA</Text>
                </Text>
                {margin !== null && (
                    <Text fontSize="sm">
                        <Text as="span" color="text.secondary">Margin: </Text>
                        <Text
                            as="span"
                            fontWeight="semibold"
                            color={margin >= 0 ? "success.700" : "error.600"}
                        >
                            {margin >= 0 ? "+" : ""}{margin.toFixed(2)} DA / {unit || "unit"}
                        </Text>
                    </Text>
                )}
            </HStack>
        </VStack>
    )
}

export default Pricing
