import { providerApi } from "@/api/provider.api"
import { toaster } from "@/components/ui/toaster"
import Button from "@/shared/components/atoms/button"
import Typography from "@/shared/components/atoms/typography"
import TextField from "@/shared/components/molecules/Forms/textField"
import type { CreateProviderDTO } from "@/shared/types/provider.types"
import { Box, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const required = (label: string) => `${label} is required`

const emailPattern = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address",
}

const digitsPattern = {
    value: /^[0-9]+$/,
    message: "Use digits only",
}

const Section = ({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: React.ReactNode
}) => (
    <Box>
        <Box mb={4}>
            <Typography variant="body-sm" fontWeight="semibold" color="neutral.900">
                {title}
            </Typography>
            <Text fontSize="xs" color="neutral.500" mt={1}>
                {description}
            </Text>
        </Box>
        {children}
    </Box>
)

const CreateProviderPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<CreateProviderDTO>({
        mode: "onBlur",
    })

    const createMutation = useMutation({
        mutationFn: providerApi.create,
        onSuccess: (provider) => {
            queryClient.invalidateQueries({ queryKey: ["providers"] })
            toaster.create({
                title: "Provider created",
                description: `${provider.name} has been created successfully.`,
                type: "success",
            })
            navigate("/providers")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to create provider. Please try again.",
                type: "error",
            })
        },
    })

    const handleBack = () => {
        if (!isDirty || window.confirm("Discard this provider draft?")) {
            navigate("/providers")
        }
    }

    const onSubmit = (data: CreateProviderDTO) => {
        createMutation.mutate({
            ...data,
            email: data.email.trim(),
            name: data.name.trim(),
            company: data.company.trim(),
            bankName: data.bankName.trim(),
            NIF: data.NIF.trim(),
            NIS: data.NIS.trim(),
            articleNumber: data.articleNumber.trim(),
            address: data.address.trim(),
            phone: data.phone.trim(),
        })
    }

    return (
        <Box>
            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                gap={4}
                mb={6}
            >


                <Box
                    px={4}
                    py={3}
                    bg="primary.50"
                    border="1px solid"
                    borderColor="primary.200"
                    borderRadius="lg"
                    maxW={{ base: "full", md: "72" }}
                >
                    <Text fontSize="xs" color="primary.700" fontWeight="medium">
                        Required fields are validated before the provider is saved.
                    </Text>
                </Box>
            </Flex>

            <Box
                as="form"
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="neutral.200"
                overflow="hidden"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box px={{ base: 5, md: 8 }} py={5} bg="neutral.50" borderBottom="1px solid" borderColor="neutral.200">
                    <Typography variant="body-sm" fontWeight="semibold" color="neutral.800">
                        Provider Details
                    </Typography>
                    <Text fontSize="xs" color="neutral.500" mt={1}>
                        This information appears in provider records, invoices, and purchase workflows.
                    </Text>
                </Box>

                <Box px={{ base: 5, md: 8 }} py={6}>
                    <VStack gap={8} align="stretch">
                        <Section
                            title="Identity"
                            description="Basic provider and company information."
                        >
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                <TextField
                                    label="Provider Name"
                                    placeholder="e.g. Samir Benali"
                                    error={errors.name?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("name", {
                                        required: required("Provider name"),
                                        minLength: {
                                            value: 2,
                                            message: "Provider name must be at least 2 characters",
                                        },
                                    })}
                                />
                                <TextField
                                    label="Company"
                                    placeholder="e.g. Delta Supplies"
                                    error={errors.company?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("company", {
                                        required: required("Company"),
                                        minLength: {
                                            value: 2,
                                            message: "Company must be at least 2 characters",
                                        },
                                    })}
                                />
                            </SimpleGrid>
                        </Section>

                        <Section
                            title="Contact"
                            description="How your team can reach this provider."
                        >
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                <TextField
                                    label="Email"
                                    placeholder="provider@example.com"
                                    type="email"
                                    error={errors.email?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("email", {
                                        required: required("Email"),
                                        pattern: emailPattern,
                                    })}
                                />
                                <TextField
                                    label="Phone"
                                    placeholder="0550123456"
                                    error={errors.phone?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("phone", {
                                        required: required("Phone"),
                                        minLength: {
                                            value: 6,
                                            message: "Phone must be at least 6 characters",
                                        },
                                    })}
                                />
                            </SimpleGrid>
                            <TextField
                                label="Address"
                                placeholder="Street, city, state"
                                error={errors.address?.message}
                                required
                                showRequiredIndicator
                                {...register("address", {
                                    required: required("Address"),
                                    minLength: {
                                        value: 4,
                                        message: "Address must be at least 4 characters",
                                    },
                                })}
                            />
                        </Section>

                        <Section
                            title="Banking"
                            description="Payment information used by finance and accounting."
                        >
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                <TextField
                                    label="Bank Name"
                                    placeholder="e.g. Banque Nationale"
                                    error={errors.bankName?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("bankName", {
                                        required: required("Bank name"),
                                    })}
                                />
                                <TextField
                                    label="Bank Account Number"
                                    placeholder="Digits only"
                                    inputMode="numeric"
                                    error={errors.bankAccountNumber?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("bankAccountNumber", {
                                        required: required("Bank account number"),
                                        valueAsNumber: true,
                                        validate: value =>
                                            Number.isFinite(value) || "Bank account number must be a number",
                                    })}
                                />
                            </SimpleGrid>
                        </Section>

                        <Section
                            title="Legal And Tax"
                            description="Registration identifiers required for compliance."
                        >
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                <TextField
                                    label="NIF"
                                    placeholder="Tax identification number"
                                    error={errors.NIF?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("NIF", {
                                        required: required("NIF"),
                                        pattern: digitsPattern,
                                    })}
                                />
                                <TextField
                                    label="NIS"
                                    placeholder="Statistical identification number"
                                    error={errors.NIS?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("NIS", {
                                        required: required("NIS"),
                                        pattern: digitsPattern,
                                    })}
                                />
                                <TextField
                                    label="Commercial Register Number"
                                    placeholder="Digits only"
                                    inputMode="numeric"
                                    error={errors.commercialRegisterNumber?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("commercialRegisterNumber", {
                                        required: required("Commercial register number"),
                                        valueAsNumber: true,
                                        validate: value =>
                                            Number.isFinite(value) || "Commercial register number must be a number",
                                    })}
                                />
                                <TextField
                                    label="Article Number"
                                    placeholder="Article number"
                                    error={errors.articleNumber?.message}
                                    required
                                    showRequiredIndicator
                                    {...register("articleNumber", {
                                        required: required("Article number"),
                                    })}
                                />
                            </SimpleGrid>
                        </Section>

                        {createMutation.isError && (
                            <Box p={3} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="md">
                                <Typography variant="body-sm" color="error.600">
                                    Failed to create provider. Please review the form and try again.
                                </Typography>
                            </Box>
                        )}
                    </VStack>
                </Box>

                <Flex
                    px={{ base: 5, md: 8 }}
                    py={5}
                    bg="neutral.50"
                    borderTop="1px solid"
                    borderColor="neutral.200"
                    justify="space-between"
                    align={{ base: "stretch", md: "center" }}
                    direction={{ base: "column", md: "row" }}
                    gap={3}
                >
                    <Text fontSize="xs" color="neutral.500">
                        Provider records can be edited after creation.
                    </Text>

                    <Flex gap={3} justify={{ base: "stretch", md: "flex-end" }}>
                        <Box w={{ base: "full", md: "28" }}>
                            <Button
                                variant="secondary"
                                size="md"
                                type="button"
                                disabled={!isDirty || createMutation.isPending}
                                onClick={() => reset()}
                            >
                                Reset
                            </Button>
                        </Box>
                        <Box w={{ base: "full", md: "32" }}>
                            <Button
                                variant="secondary"
                                size="md"
                                type="button"
                                disabled={createMutation.isPending}
                                onClick={handleBack}
                            >
                                Cancel
                            </Button>
                        </Box>
                        <Box w={{ base: "full", md: "44" }}>
                            <Button
                                variant="primary"
                                size="md"
                                type="submit"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? "Creating..." : "Create Provider"}
                            </Button>
                        </Box>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}

export default CreateProviderPage
