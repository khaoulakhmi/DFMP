import { productApi } from "@/api/product.api"
import { designationApi } from "@/api/designation.api"
import { lotApi } from "@/api/lot.api"
import Button from "@/shared/components/atoms/button"
import TextField from "@/shared/components/molecules/Forms/textField"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import { TVA, type Product, type UpdateProductDTO } from "@/shared/types/product.types"
import { Box, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { FiBox } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"

const EditProductPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UpdateProductDTO & { designationId: number, lotId: number }>({ mode: "onBlur" })

    const { data: product, isLoading } = useQuery<Product>({ queryKey: ["products", id], queryFn: () => productApi.getById(Number(id)), enabled: Boolean(id) })
    const { data: designations = [] as Designation[] } = useQuery<Designation[]>({ queryKey: ["designations"], queryFn: designationApi.getAll })
    const { data: lots = [] as Lot[] } = useQuery<Lot[]>({ queryKey: ["lots"], queryFn: lotApi.getAll })
    const designationId = useWatch({ control, name: "designationId" })
    const unitPrice = Number(useWatch({ control, name: "unitPrice" }) || 0)
    const providerPrice = Number(useWatch({ control, name: "providerPrice" }) || 0)
    const unit = useWatch({ control, name: "unit" }) || "Unit"
    const filteredLots = lots.filter(lot => lot.designationId === Number(designationId))

    useEffect(() => {
        if (!product) return
        reset(product)
    }, [product, reset])

    const updateMutation = useMutation({
        mutationFn: (data: UpdateProductDTO) => productApi.update(Number(id), data),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({ queryKey: ["products", id] })
            toaster.create({ title: "Product updated", description: `${updated.name} has been updated.`, type: "success" })
            navigate(`/products/${id}`)
        },
    })

    const onSubmit = (data: UpdateProductDTO) => {
        updateMutation.mutate(data)
    }

    if (isLoading || !product) return <Flex h="64" align="center" justify="center"><Spinner /></Flex>

    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation mb={4} items={[{ label: "Dashboard", href: "/" }, { label: "Products", href: "/products" }, { label: "Edit Product", isCurrentPage: true }]} />
            <Box as="form" onSubmit={handleSubmit(onSubmit)} bg="white" border="1px solid" borderColor="neutral.200" borderRadius="xl" overflow="hidden">
                <HStack p={5} gap={4} borderBottom="1px solid" borderColor="neutral.200">
                    <Flex w="10" h="10" align="center" justify="center" bg="success.50" color="success.700" borderRadius="md"><FiBox /></Flex>
                    <Box>
                        <Text fontWeight="bold">Edit Product</Text>
                        <Text fontSize="sm" color="neutral.600">{product.name} - {product.lot?.name}</Text>
                    </Box>
                </HStack>
                <VStack align="stretch" gap={6} p={5}>
                    <Text fontSize="xs" fontWeight="bold" color="neutral.500">GENERAL INFORMATION</Text>
                    <TextField label="Product name" error={errors.name?.message} required {...register("name", { required: "Product name is required" })} />
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <TextField label="Unit" error={errors.unit?.message} required {...register("unit", { required: "Unit is required" })} />
                        <SelectField label="Designation" required {...register("designationId", { valueAsNumber: true })}>
                            {designations.map(designation => <option key={designation.id} value={designation.id}>{designation.name}</option>)}
                        </SelectField>
                    </SimpleGrid>
                    <SelectField label="Lot" required {...register("lotId", { valueAsNumber: true })}>
                        {filteredLots.map(lot => <option key={lot.id} value={lot.id}>{lot.name}</option>)}
                    </SelectField>
                    <Text fontSize="xs" fontWeight="bold" color="neutral.500">PRICING</Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <TextField label="Unit price" type="number" required {...register("unitPrice", { valueAsNumber: true })} />
                        <TextField label="Provider price" type="number" required {...register("providerPrice", { valueAsNumber: true })} />
                        <TextField label="Evaluation price" type="number" required {...register("evaluationPrice", { valueAsNumber: true })} />
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
                        <TextField label="Quantity min" type="number" required {...register("quantityMin", { valueAsNumber: true })} />
                        <TextField label="Quantity max" type="number" required {...register("quantityMax", { valueAsNumber: true })} />
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
