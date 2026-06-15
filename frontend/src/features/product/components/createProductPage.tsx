// CreateProductPage.tsx
import { productApi } from "@/api/product.api"
import Button from "@/shared/components/atoms/button"
import TextField from "@/shared/components/molecules/Forms/textField"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import { TVA, type CreateProductDTO } from "@/shared/types/product.types"
import {
    Box, HStack, SimpleGrid, Text, VStack, Heading, Separator
} from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import { designationApi } from "@/api/designation.api"

const required = (label: string) => `${label} is required`

const UNIT_OPTIONS = [
    "Kg", "Litre", "Pièce", "Boîte", "Carton",
    "Sac", "Tonne", "m²", "m³", "Unité"
]

type ProductForm = {
    name: string
    unit: string
    unitPrice: number
    providerPrice?: number
    evaluationPrice?: number
    quantityMin: number
    quantityMax: number
    tva: TVA
    designationId: string
}

// interface CreateProductPageProps {
//     designations: Designation[]
// }

const CreateProductPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { data: designations = [] } = useQuery({
        queryKey: ["designations"],
        queryFn: designationApi.getAll,
    })
    const [searchParams] = useSearchParams()
    const defaultDesignationId = searchParams.get("designationId") ?? ""

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isDirty },
    } = useForm<ProductForm>({
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
            designationId: defaultDesignationId,
        },
    })

    const unitPrice = Number(useWatch({ control, name: "unitPrice" }) || 0)
    const providerPrice = Number(useWatch({ control, name: "providerPrice" }) || 0)
    const tva = useWatch({ control, name: "tva" })
    const unit = useWatch({ control, name: "unit" })

    const tvaRate = tva === TVA.NINETEEN ? 0.19 : tva === TVA.NINE ? 0.09 : 0
    const priceTtc = unitPrice * (1 + tvaRate)
    const margin = providerPrice > 0 ? unitPrice - providerPrice : null

    const createMutation = useMutation({
        mutationFn: productApi.create,
        onSuccess: (product) => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            toaster.create({
                title: "Product created",
                description: `${product.name} has been created successfully.`,
                type: "success",
            })
            navigate("/products")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to create product. Please try again.",
                type: "error",
            })
        },
    })

    const handleCancel = () => {
        if (!isDirty || window.confirm("Discard unsaved changes?")) {
            navigate(-1)
        }
    }

    const onSubmit = (data: ProductForm) => {
        const payload: CreateProductDTO = {
            name: data.name.trim(),
            unit: data.unit.trim(),
            unitPrice: Number(data.unitPrice),
            providerPrice: data.providerPrice ? Number(data.providerPrice) : 0,
            evaluationPrice: data.evaluationPrice ? Number(data.evaluationPrice) : 0,
            quantityMin: Number(data.quantityMin),
            quantityMax: Number(data.quantityMax),
            tva: data.tva,
            designationId: Number(data.designationId),
            // lotId is assigned later
        }
        createMutation.mutate(payload)
    }

    const breadcrumbItems = [
        { label: "Dashboard", href: "/" },
        { label: "Products", href: "/products" },
        { label: "New Product", isCurrentPage: true },
    ]

    return (
        <Box maxW="720px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
            <BreadcrumbNavigation items={breadcrumbItems} separator=">" />

            <VStack align="stretch" gap={1} mb={8}>
                <Heading size="lg" fontWeight="semibold">New Product</Heading>
                <Text color="text.secondary" fontSize="sm">
                    Fill in the product details. The lot will be assigned separately.
                </Text>
            </VStack>

            <Box
                as="form"
                id="create-product-form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <VStack gap={8} align="stretch">

                    {/* — General — */}
                    <VStack gap={4} align="stretch">
                        <Text fontWeight="medium" fontSize="sm" color="text.secondary"
                            textTransform="uppercase" letterSpacing="wider">
                            General
                        </Text>
                        <Separator />
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <TextField
                                label="Product name"
                                error={errors.name?.message}
                                required
                                showRequiredIndicator
                                {...register("name", { required: required("Product name") })}
                            />
                            <SelectField
                                label="Unit"
                                error={errors.unit?.message}
                                required
                                showRequiredIndicator
                                {...register("unit", { required: required("Unit") })}
                            >
                                {UNIT_OPTIONS.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </SelectField>
                        </SimpleGrid>
                        <SelectField
                            label="Designation"
                            error={errors.designationId?.message}
                            required
                            showRequiredIndicator
                            {...register("designationId", { required: required("Designation") })}
                        >
                            <option value="">Select designation</option>
                            {designations.map((d: Designation) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </SelectField>
                        <Box
                            px={3} py={2} bg="blue.50" borderRadius="md"
                            borderLeft="3px solid" borderColor="blue.400"
                        >
                            <Text fontSize="xs" color="blue.700">
                                The lot will be assigned after creation, from the lot management page.
                            </Text>
                        </Box>
                    </VStack>

                    {/* — Pricing — */}
                    <VStack gap={4} align="stretch">
                        <Text fontWeight="medium" fontSize="sm" color="text.secondary"
                            textTransform="uppercase" letterSpacing="wider">
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
                                    min: { value: 0, message: "Must be ≥ 0" }
                                })}
                            />
                            <TextField
                                label="Provider price (DA)"
                                type="number"
                                error={errors.providerPrice?.message}
                                {...register("providerPrice", {
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Must be ≥ 0" }
                                })}
                            />
                            <TextField
                                label="Evaluation price (DA)"
                                type="number"
                                error={errors.evaluationPrice?.message}
                                {...register("evaluationPrice", {
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Must be ≥ 0" }
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

                        {/* Live computed summary */}
                        <HStack
                            px={4} py={3} bg="neutral.50" borderRadius="md"
                            justify="space-between" wrap="wrap" gap={2}
                        >
                            <Text fontSize="sm">
                                <Text as="span" color="text.secondary">Price TTC: </Text>
                                <Text as="span" fontWeight="semibold">{priceTtc.toFixed(2)} DA</Text>
                            </Text>
                            {margin !== null && (
                                <Text fontSize="sm">
                                    <Text as="span" color="text.secondary">Margin: </Text>
                                    <Text as="span" fontWeight="semibold"
                                        color={margin >= 0 ? "green.600" : "red.500"}>
                                        {margin >= 0 ? "+" : ""}{margin.toFixed(2)} DA / {unit || "unit"}
                                    </Text>
                                </Text>
                            )}
                        </HStack>
                    </VStack>

                    {/* — Quantities — */}
                    <VStack gap={4} align="stretch">
                        <Text fontWeight="medium" fontSize="sm" color="text.secondary"
                            textTransform="uppercase" letterSpacing="wider">
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
                                    min: { value: 0, message: "Must be ≥ 0" }
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
                                    min: { value: 0, message: "Must be ≥ 0" }
                                })}
                            />
                        </SimpleGrid>
                    </VStack>

                    {/* — Actions — */}
                    <HStack justify="flex-end" gap={3} pt={2} wrap="wrap">
                        <Box w={{ base: "full", sm: "32" }}>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={createMutation.isPending}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                        <Box w={{ base: "full", sm: "40" }}>
                            <Button
                                type="submit"
                                form="create-product-form"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? "Creating..." : "Create Product"}
                            </Button>
                        </Box>
                    </HStack>

                </VStack>
            </Box>
        </Box>
    )
}

export default CreateProductPage
