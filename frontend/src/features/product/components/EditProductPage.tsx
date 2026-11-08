import { productApi } from "@/api/product.api"
import Button from "@/shared/components/atoms/button"
import TextField from "@/shared/components/molecules/Forms/textField"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import DesignationSelect from "@/shared/components/molecules/Forms/DesignationSelect"
import LotSelect from "@/shared/components/molecules/Forms/LotSelect"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import { TVA, type Product, type UpdateProductDTO } from "@/shared/types/product.types"
import { Box, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { FiBox } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"

type EditProductForm = {
    name: string
    unit: string
    unitPrice: number
    providerPrice: number
    evaluationPrice: number
    tva: TVA
    quantityMin: number
    quantityMax: number
    designationId: string
    lotId: string
}

const toFormValues = (product: Product): EditProductForm => ({
    name: product.name,
    unit: product.unit,
    unitPrice: Number(product.unitPrice),
    providerPrice: Number(product.providerPrice ?? 0),
    evaluationPrice: Number(product.evaluationPrice ?? 0),
    tva: product.tva,
    quantityMin: product.quantityMin,
    quantityMax: product.quantityMax,
    designationId: String(product.designationId),
    lotId: product.lotId === null ? "" : String(product.lotId),
})

// Only fields the API accepts; the strict schema rejects anything else.
const toPayload = (data: EditProductForm): UpdateProductDTO => ({
    name: data.name.trim(),
    unit: data.unit.trim(),
    unitPrice: Number(data.unitPrice),
    providerPrice: Number(data.providerPrice),
    evaluationPrice: Number(data.evaluationPrice),
    tva: data.tva,
    quantityMin: Number(data.quantityMin),
    quantityMax: Number(data.quantityMax),
    designationId: Number(data.designationId),
    lotId: data.lotId ? Number(data.lotId) : null,
})

const EditProductPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<EditProductForm>({ mode: "onBlur" })

    const { data: product, isLoading, isError } = useQuery<Product>({
        queryKey: ["products", id],
        queryFn: () => productApi.getById(String(id)),
        enabled: Boolean(id),
    })
    const designationId = useWatch({ control, name: "designationId" })
    const unitPrice = Number(useWatch({ control, name: "unitPrice" }) || 0)
    const providerPrice = Number(useWatch({ control, name: "providerPrice" }) || 0)
    const unit = useWatch({ control, name: "unit" }) || "Unit"

    useEffect(() => {
        if (product) reset(toFormValues(product))
    }, [product, reset])

    const updateMutation = useMutation({
        mutationFn: (data: UpdateProductDTO) => productApi.update(String(id), data),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({ queryKey: ["lots"] })
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            toaster.create({ title: "Product updated", description: `${updated.name} has been updated.`, type: "success" })
            navigate(`/products/${id}`)
        },
        onError: () => {
            toaster.create({ title: "Error", description: "Failed to update product. Please try again.", type: "error" })
        },
    })

    const onSubmit = (data: EditProductForm) => {
        updateMutation.mutate(toPayload(data))
    }

    if (isLoading) return <Flex h="64" align="center" justify="center"><Spinner /></Flex>

    if (isError || !product) {
        return (
            <Box p={6} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl">
                <Text color="error.600" fontWeight="medium">Product not found or failed to load.</Text>
            </Box>
        )
    }

    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation mb={4} items={[{ label: "Dashboard", href: "/" }, { label: "Products", href: "/products" }, { label: "Edit Product", isCurrentPage: true }]} />
            <Box as="form" onSubmit={handleSubmit(onSubmit)} bg="white" border="1px solid" borderColor="neutral.200" borderRadius="xl" overflow="hidden">
                <HStack p={5} gap={4} borderBottom="1px solid" borderColor="neutral.200">
                    <Flex w="10" h="10" align="center" justify="center" bg="success.50" color="success.700" borderRadius="md"><FiBox /></Flex>
                    <Box>
                        <Text fontWeight="bold">Edit Product</Text>
                        <Text fontSize="sm" color="neutral.600">{product.name}{product.lot ? ` - ${product.lot.name}` : ""}</Text>
                    </Box>
                </HStack>
                <VStack align="stretch" gap={6} p={5}>
                    <Text fontSize="xs" fontWeight="bold" color="neutral.500">GENERAL INFORMATION</Text>
                    <TextField label="Product name" error={errors.name?.message} required {...register("name", { required: "Product name is required" })} />
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <TextField label="Unit" error={errors.unit?.message} required {...register("unit", { required: "Unit is required" })} />
                        <Controller
                            control={control}
                            name="designationId"
                            rules={{ required: "Designation is required" }}
                            render={({ field }) => (
                                <DesignationSelect
                                    label="Designation"
                                    required
                                    error={errors.designationId?.message}
                                    selectedItem={product.designation ?? null}
                                    value={field.value}
                                    onChange={designation => {
                                        const next = designation ? String(designation.id) : ""
                                        // The lot must belong to the chosen designation.
                                        if (next !== field.value) setValue("lotId", "")
                                        field.onChange(next)
                                    }}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </SimpleGrid>
                    <Controller
                        control={control}
                        name="lotId"
                        render={({ field }) => (
                            <LotSelect
                                label="Lot"
                                placeholder="No lot"
                                clearable
                                designationId={designationId ? Number(designationId) : null}
                                selectedItem={product.lot ?? null}
                                value={field.value}
                                onChange={lot => field.onChange(lot ? String(lot.id) : "")}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                    <Text fontSize="xs" fontWeight="bold" color="neutral.500">PRICING</Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <TextField label="Unit price" type="number" step="0.01" required {...register("unitPrice", { valueAsNumber: true, required: true, min: 0 })} />
                        <TextField label="Provider price" type="number" step="0.01" required {...register("providerPrice", { valueAsNumber: true, min: 0 })} />
                        <TextField label="Evaluation price" type="number" step="0.01" required {...register("evaluationPrice", { valueAsNumber: true, min: 0 })} />
                    </SimpleGrid>
                    <SelectField label="TVA" required {...register("tva")}>
                        <option value={TVA.ZERO}>0%</option>
                        <option value={TVA.NINE}>9%</option>
                        <option value={TVA.NINETEEN}>19%</option>
                    </SelectField>
                    <Box px={3} py={2} bg="neutral.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="semibold">Margin: {(unitPrice - providerPrice).toFixed(2)} DA / {unit}</Text>
                    </Box>
                    <Text fontSize="xs" fontWeight="bold" color="neutral.500">QUANTITIES</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <TextField label="Quantity min" type="number" required {...register("quantityMin", { valueAsNumber: true, required: true, min: 0 })} />
                        <TextField label="Quantity max" type="number" required {...register("quantityMax", { valueAsNumber: true, required: true, min: 0 })} />
                    </SimpleGrid>
                </VStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} p={5} borderTop="1px solid" borderColor="neutral.200">
                    <Button type="button" variant="secondary" onClick={() => navigate(`/products/${id}`)}>Cancel</Button>
                    <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Save Changes"}</Button>
                </SimpleGrid>
            </Box>
        </Box>
    )
}

export default EditProductPage
