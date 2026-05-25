import { productApi } from "@/api/product.api"
import Button from "@/shared/components/atoms/button"
import TextField from "@/shared/components/molecules/Forms/textField"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import Modal from "@/shared/components/molecules/modal"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import { TVA, type CreateProductDTO } from "@/shared/types/product.types"
import { Box, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"

const required = (label: string) => `${label} is required`

type ProductForm = {
    name: string
    unit: string
    unitPrice: number
    providerPrice: number
    evaluationPrice: number
    quantityMin: number
    quantityMax: number
    tva: TVA
    designationId: string
    lotId: string
}

interface CreateProductModalProps {
    open: boolean
    onClose: () => void
    designations: Designation[]
    lots: Lot[]
    defaultDesignationId?: number | null
    defaultLotId?: number | null
}

const CreateProductModal = ({
    open,
    onClose,
    designations,
    lots,
    defaultDesignationId,
    defaultLotId,
}: CreateProductModalProps) => {
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset, control, setValue, formState: { errors, isDirty } } = useForm<ProductForm>({
        mode: "onBlur",
        defaultValues: {
            name: "",
            unit: "Kg",
            unitPrice: 0,
            providerPrice: 0,
            evaluationPrice: 0,
            quantityMin: 0,
            quantityMax: 0,
            tva: TVA.NINETEEN,
            designationId: defaultDesignationId ? String(defaultDesignationId) : "",
            lotId: defaultLotId ? String(defaultLotId) : "",
        },
    })

    const designationId = useWatch({ control, name: "designationId" })
    const unitPrice = Number(useWatch({ control, name: "unitPrice" }) || 0)
    const providerPrice = Number(useWatch({ control, name: "providerPrice" }) || 0)
    const tva = useWatch({ control, name: "tva" })
    const filteredLots = lots.filter(lot => lot.designationId === Number(designationId))
    const tvaRate = tva === TVA.NINETEEN ? 0.19 : tva === TVA.NINE ? 0.09 : 0
    const priceTtc = unitPrice * (1 + tvaRate)

    useEffect(() => {
        if (open) {
            reset({
                name: "",
                unit: "Kg",
                unitPrice: 0,
                providerPrice: 0,
                evaluationPrice: 0,
                quantityMin: 0,
                quantityMax: 0,
                tva: TVA.NINETEEN,
                designationId: defaultDesignationId ? String(defaultDesignationId) : "",
                lotId: defaultLotId ? String(defaultLotId) : "",
            })
        }
    }, [defaultDesignationId, defaultLotId, open, reset])

    useEffect(() => {
        if (!designationId) return
        const currentLotId = control._formValues.lotId
        if (!filteredLots.some(lot => String(lot.id) === currentLotId)) {
            setValue("lotId", filteredLots[0] ? String(filteredLots[0].id) : "")
        }
    }, [control._formValues.lotId, designationId, filteredLots, setValue])

    const createMutation = useMutation({
        mutationFn: productApi.create,
        onSuccess: (product) => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            toaster.create({
                title: "Product created",
                description: `${product.name} has been created successfully.`,
                type: "success",
            })
            onClose()
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to create product. Please try again.",
                type: "error",
            })
        },
    })

    const handleClose = () => {
        if (!isDirty || window.confirm("Discard this product draft?")) onClose()
    }

    const onSubmit = (data: ProductForm) => {
        const payload: CreateProductDTO = {
            name: data.name.trim(),
            unit: data.unit.trim(),
            unitPrice: Number(data.unitPrice),
            providerPrice: Number(data.providerPrice),
            evaluationPrice: Number(data.evaluationPrice),
            quantityMin: Number(data.quantityMin),
            quantityMax: Number(data.quantityMax),
            tva: data.tva,
            designationId: Number(data.designationId),
            lotId: Number(data.lotId),
        }
        createMutation.mutate(payload)
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Add Product"
            description="Create a product inside the selected lot."
            size="lg"
            closeOnInteractOutside={!isDirty && !createMutation.isPending}
            closeOnEscape={!createMutation.isPending}
            footer={(
                <HStack gap={3} justify="flex-end" w="full" wrap="wrap">
                    <Box w={{ base: "full", sm: "32" }}>
                        <Button type="button" variant="secondary" disabled={createMutation.isPending} onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                    <Box w={{ base: "full", sm: "40" }}>
                        <Button type="submit" form="create-product-form" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Creating..." : "Create Product"}
                        </Button>
                    </Box>
                </HStack>
            )}
        >
            <Box as="form" id="create-product-form" onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={5} align="stretch">
                    <TextField label="Product name" error={errors.name?.message} required showRequiredIndicator {...register("name", { required: required("Product name") })} />
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <TextField label="Unit" error={errors.unit?.message} required showRequiredIndicator {...register("unit", { required: required("Unit") })} />
                        <SelectField label="Designation" error={errors.designationId?.message} required showRequiredIndicator {...register("designationId", { required: required("Designation") })}>
                            <option value="">Select designation</option>
                            {designations.map(designation => <option key={designation.id} value={designation.id}>{designation.name}</option>)}
                        </SelectField>
                    </SimpleGrid>
                    <SelectField label="Lot" error={errors.lotId?.message} required showRequiredIndicator {...register("lotId", { required: required("Lot") })}>
                        <option value="">Select lot</option>
                        {filteredLots.map(lot => <option key={lot.id} value={lot.id}>{lot.name}</option>)}
                    </SelectField>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <TextField label="Unit price" type="number" error={errors.unitPrice?.message} required showRequiredIndicator {...register("unitPrice", { required: required("Unit price"), valueAsNumber: true })} />
                        <TextField label="Provider price" type="number" error={errors.providerPrice?.message} required showRequiredIndicator {...register("providerPrice", { required: required("Provider price"), valueAsNumber: true })} />
                        <TextField label="Evaluation price" type="number" error={errors.evaluationPrice?.message} required showRequiredIndicator {...register("evaluationPrice", { required: required("Evaluation price"), valueAsNumber: true })} />
                    </SimpleGrid>
                    <SelectField label="TVA" error={errors.tva?.message} required showRequiredIndicator {...register("tva", { required: required("TVA") })}>
                        <option value={TVA.ZERO}>0%</option>
                        <option value={TVA.NINE}>9%</option>
                        <option value={TVA.NINETEEN}>19%</option>
                    </SelectField>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <TextField label="Quantity min" type="number" error={errors.quantityMin?.message} required showRequiredIndicator {...register("quantityMin", { required: required("Quantity min"), valueAsNumber: true })} />
                        <TextField label="Quantity max" type="number" error={errors.quantityMax?.message} required showRequiredIndicator {...register("quantityMax", { required: required("Quantity max"), valueAsNumber: true })} />
                    </SimpleGrid>
                    <Box px={3} py={2} bg="neutral.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="semibold">
                            Price TTC: {priceTtc.toFixed(2)} DA - Margin: {(unitPrice - providerPrice).toFixed(2)} DA / {control._formValues.unit || "Unit"}
                        </Text>
                    </Box>
                </VStack>
            </Box>
        </Modal>
    )
}

export default CreateProductModal
