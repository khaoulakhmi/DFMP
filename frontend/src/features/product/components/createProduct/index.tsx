import type { StepperItem } from "@/shared/components/molecules/stepper"
import { designationApi } from "@/api/designation.api"
import { productApi } from "@/api/product.api"
import Button from "@/shared/components/atoms/button"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import { TVA, type CreateProductDTO } from "@/shared/types/product.types"
import { Box, Flex, HStack, Heading, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, type MouseEvent } from "react"
import { useForm, useWatch } from "react-hook-form"
import { FiDollarSign, FiPackage, FiSliders } from "react-icons/fi"
import { useNavigate, useSearchParams } from "react-router-dom"
import GeneralInfo from "./steps/generalInformation"
import Pricing from "./steps/pricing"
import Quantity from "./steps/quantity"
import Stepper from "@/shared/components/molecules/stepper"
import type { ProductForm } from "./types"

const UNIT_OPTIONS = [
    "Kg",
    "Litre",
    "Piece",
    "Boite",
    "Carton",
    "Sac",
    "Tonne",
    "m2",
    "m3",
    "Unite",
]

type FieldName = keyof ProductForm

const stepFields: FieldName[][] = [
    ["name", "unit", "designationId"],
    ["unitPrice", "providerPrice", "evaluationPrice", "tva"],
    ["quantityMin", "quantityMax"],
]

const CreateProductPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [searchParams] = useSearchParams()
    const [activeStep, setActiveStep] = useState(0)

    const defaultDesignationId = searchParams.get("designationId") ?? ""
    const defaultLotId = searchParams.get("lotId") ?? ""

    const {
        register,
        handleSubmit,
        trigger,
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
            lotId: defaultLotId,
        },
    })

    const { data: designations = [] as Designation[], isLoading, isError } = useQuery<Designation[]>({
        queryKey: ["designations"],
        queryFn: designationApi.getAll,
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
            queryClient.invalidateQueries({ queryKey: ["lots"] })
            toaster.create({
                title: "Product created",
                description: `${product.name} has been created successfully.`,
                type: "success",
            })
            navigate(defaultLotId ? `/lots/${defaultLotId}` : "/products")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to create product. Please try again.",
                type: "error",
            })
        },
    })

    const steps: StepperItem[] = useMemo(() => [
        {
            title: "General",
            description: "Name, unit, and designation",
            icon: <FiPackage />,
            content: (
                <GeneralInfo
                    register={register}
                    errors={errors}
                    designations={designations}
                    unitOptions={UNIT_OPTIONS}
                />
            ),
        },
        {
            title: "Pricing",
            description: "Prices and tax",
            icon: <FiDollarSign />,
            content: (
                <Pricing
                    register={register}
                    errors={errors}
                    priceTtc={priceTtc}
                    margin={margin}
                    unit={unit}
                />
            ),
        },
        {
            title: "Quantities",
            description: "Authorized range",
            icon: <FiSliders />,
            content: (
                <Quantity
                    register={register}
                    errors={errors}
                    unit={unit}
                />
            ),
        },
    ], [designations, errors, margin, priceTtc, register, unit])

    const goNext = async () => {
        const fields = stepFields[activeStep]
        if (!fields) return

        const isValid = await trigger(fields, { shouldFocus: true })
        if (isValid) setActiveStep(step => Math.min(step + 1, steps.length - 1))
    }

    const handleContinue = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        void goNext()
    }

    const goBack = () => {
        setActiveStep(step => Math.max(step - 1, 0))
    }

    const handleCancel = () => {
        if (!isDirty || window.confirm("Discard unsaved changes?")) {
            navigate(-1)
        }
    }

    const onSubmit = (data: ProductForm) => {
        if (activeStep !== steps.length - 1) {
            void goNext()
            return
        }

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
            ...(data.lotId ? { lotId: Number(data.lotId) } : {}),
        }

        createMutation.mutate(payload)
    }

    if (isLoading) {
        return (
            <Flex h="64" align="center" justify="center">
                <Spinner color="primary.500" />
            </Flex>
        )
    }

    if (isError) {
        return (
            <Box p={6} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl">
                <Text color="error.600" fontWeight="medium">Failed to load designations.</Text>
            </Box>
        )
    }

    return (
        <Box maxW="800px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
            <BreadcrumbNavigation
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Products", href: "/products" },
                    { label: "New Product", isCurrentPage: true },
                ]}
                separator=">"
            />

            <VStack align="stretch" gap={1} mb={6}>
                <Heading size="lg" fontWeight="semibold">New Product</Heading>
                <Text color="text.secondary" fontSize="sm">
                    Complete product details step by step.
                </Text>
            </VStack>

            <Box as="form" id="create-product-form" onSubmit={handleSubmit(onSubmit)}>
                <Stepper
                    key={activeStep}
                    steps={steps}
                    defaultStep={activeStep}
                    showControls={false}
                    size="sm"
                    shape="circle"
                />

                <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} gap={3} mt={5} direction={{ base: "column", sm: "row" }}>
                    <Box w={{ base: "full", sm: "32" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={createMutation.isPending}
                            onClick={activeStep === 0 ? handleCancel : goBack}
                        >
                            {activeStep === 0 ? "Cancel" : "Back"}
                        </Button>
                    </Box>

                    <HStack gap={3} justify="flex-end">
                        <Box w={{ base: "full", sm: activeStep === steps.length - 1 ? "40" : "32" }}>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    type="submit"
                                    form="create-product-form"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? "Creating..." : "Create Product"}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    disabled={createMutation.isPending}
                                    onClick={handleContinue}
                                >
                                    Continue
                                </Button>
                            )}
                        </Box>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    )
}


export default CreateProductPage
