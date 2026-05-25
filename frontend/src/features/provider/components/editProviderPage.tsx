import { providerApi } from "@/api/provider.api"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import Button from "@/shared/components/atoms/button"
import Typography from "@/shared/components/atoms/typography"
import TextField from "@/shared/components/molecules/Forms/textField"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import type { UpdateProviderDTO } from "@/shared/types/provider.types"
import { Box, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FiArrowLeft, FiBriefcase, FiMail, FiPhone, FiTrash2 } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"

const required = (label: string) => `${label} is required`

const emailPattern = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address",
}

const digitsPattern = {
    value: /^[0-9]+$/,
    message: "Use digits only",
}

type SectionProps = {
    title: string
    description: string
    children: React.ReactNode
}

const getInitials = (name?: string) => {
    if (!name) return "P"

    const words = name.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return "P"
    if (words.length === 1) return words[0]?.charAt(0).toUpperCase() ?? "P"

    return `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`.toUpperCase()
}

const ProviderMeta = ({
    icon,
    label,
}: {
    icon: React.ReactElement
    label: string
}) => (
    <HStack
        gap={2}
        minW="0"
        px={3}
        py={2}
        bg="white"
        border="1px solid"
        borderColor="neutral.200"
        borderRadius="md"
    >
        <Box color="primary.600" flexShrink={0}>
            {icon}
        </Box>
        <Text fontSize="xs" color="neutral.700" fontWeight="medium" truncate>
            {label}
        </Text>
    </HStack>
)

const Section = ({ title, description, children }: SectionProps) => (
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

const EditProviderPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<UpdateProviderDTO>({
        mode: "onBlur",
    })

    const { data: provider, isLoading, isError } = useQuery({
        queryKey: ["providers", id],
        queryFn: () => providerApi.getById(id!),
        enabled: Boolean(id),
    })

    useEffect(() => {
        if (!provider) return

        reset({
            name: provider.name,
            email: provider.email,
            phone: provider.phone,
            address: provider.address,
            company: provider.company,
            bankAccountNumber: provider.bankAccountNumber,
            bankName: provider.bankName,
            NIF: provider.NIF,
            NIS: provider.NIS,
            commercialRegisterNumber: provider.commercialRegisterNumber,
            articleNumber: provider.articleNumber,
        })
    }, [provider, reset])

    const updateMutation = useMutation({
        mutationFn: (data: UpdateProviderDTO) => providerApi.update(id!, data),
        onSuccess: (updatedProvider) => {
            queryClient.invalidateQueries({ queryKey: ["providers"] })
            queryClient.invalidateQueries({ queryKey: ["providers", id] })
            toaster.create({
                title: "Provider updated",
                description: `${updatedProvider.name ?? provider?.name ?? "Provider"} has been updated successfully.`,
                type: "success",
            })
            navigate("/providers")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to update provider. Please try again.",
                type: "error",
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: () => providerApi.delete(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providers"] })
            toaster.create({
                title: "Provider deleted",
                description: `${provider?.name ?? "Provider"} has been deleted.`,
                type: "success",
            })
            navigate("/providers")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to delete provider. Please try again.",
                type: "error",
            })
        },
    })

    const handleBack = () => {
        if (!isDirty || window.confirm("Discard your provider changes?")) {
            navigate("/providers")
        }
    }

    const onSubmit = (data: UpdateProviderDTO) => {
        const payload: UpdateProviderDTO = {}

        if (data.name !== undefined) payload.name = data.name.trim()
        if (data.email !== undefined) payload.email = data.email.trim()
        if (data.phone !== undefined) payload.phone = data.phone.trim()
        if (data.address !== undefined) payload.address = data.address.trim()
        if (data.company !== undefined) payload.company = data.company.trim()
        if (data.bankName !== undefined) payload.bankName = data.bankName.trim()
        if (data.bankAccountNumber !== undefined) payload.bankAccountNumber = data.bankAccountNumber
        if (data.NIF !== undefined) payload.NIF = data.NIF.trim()
        if (data.NIS !== undefined) payload.NIS = data.NIS.trim()
        if (data.commercialRegisterNumber !== undefined) {
            payload.commercialRegisterNumber = data.commercialRegisterNumber
        }
        if (data.articleNumber !== undefined) payload.articleNumber = data.articleNumber.trim()

        updateMutation.mutate(payload)
    }

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="64" bg="white" borderRadius="xl" border="1px solid" borderColor="neutral.200">
                <VStack gap={3}>
                    <Spinner color="primary.500" />
                    <Text fontSize="sm" color="neutral.500">Loading provider...</Text>
                </VStack>
            </Flex>
        )
    }

    if (isError || !provider) {
        return (
            <Box p={6} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl">
                <Text color="error.600" fontSize="sm" fontWeight="medium">
                    Provider not found or failed to load.
                </Text>
                <Box w="28" mt={4}>
                    <Button variant="secondary" size="sm" onClick={() => navigate("/providers")}>
                        Back
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Providers", href: "/providers" },
                    { label: "Edit Provider", isCurrentPage: true },
                ]}
            />

            <Box
                mb={6}
                bg="white"
                border="1px solid"
                borderColor="neutral.200"
                borderRadius="xl"
                boxShadow="sm"
                overflow="hidden"
            >
                <Flex
                    direction={{ base: "column", lg: "row" }}
                    justify="space-between"
                    align={{ base: "stretch", lg: "center" }}
                    gap={5}
                    px={{ base: 5, md: 6 }}
                    py={{ base: 5, md: 6 }}
                    bg="linear-gradient(135deg, var(--chakra-colors-primary-50), white 58%, var(--chakra-colors-neutral-50))"
                >
                    <HStack gap={4} align="flex-start" minW="0">
                        <Box
                            w={{ base: "12", md: "14" }}
                            h={{ base: "12", md: "14" }}
                            borderRadius="lg"
                            bg="primary.600"
                            color="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="bold"
                            fontSize={{ base: "md", md: "lg" }}
                            flexShrink={0}
                            boxShadow="sm"
                        >
                            {getInitials(provider.name)}
                        </Box>

                        <Box minW="0">
                            <HStack gap={2} mb={1} wrap="wrap">
                                <Text
                                    fontSize="xs"
                                    color="primary.700"
                                    fontWeight="semibold"
                                    textTransform="uppercase"
                                >
                                    Provider Record
                                </Text>
                                {isDirty && (
                                    <Text
                                        px={2}
                                        py={0.5}
                                        bg="warning.50"
                                        color="warning.700"
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                    >
                                        Unsaved changes
                                    </Text>
                                )}
                            </HStack>
                            <Typography variant="heading">
                                Edit {provider.name}
                            </Typography>
                            <Text color="neutral.600" fontSize="sm" mt={1}>
                                Review supplier identity, contact, banking, and compliance details before saving.
                            </Text>
                        </Box>
                    </HStack>

                    <Flex gap={3} justify={{ base: "stretch", sm: "flex-end" }} wrap="wrap">
                        <Box w={{ base: "full", sm: "32" }}>
                            <Button variant="secondary" size="md" type="button" onClick={handleBack}>
                                <HStack gap={2} justify="center">
                                    <FiArrowLeft />
                                    <Text as="span">Back</Text>
                                </HStack>
                            </Button>
                        </Box>
                        <Box w={{ base: "full", sm: "44" }}>
                            <Button
                                variant="danger"
                                size="md"
                                type="button"
                                disabled={deleteMutation.isPending || updateMutation.isPending}
                                onClick={() => {
                                    if (window.confirm(`Delete ${provider.name}? This cannot be undone.`)) {
                                        deleteMutation.mutate()
                                    }
                                }}
                            >
                                <HStack gap={2} justify="center">
                                    <FiTrash2 />
                                    <Text as="span">{deleteMutation.isPending ? "Deleting..." : "Delete Provider"}</Text>
                                </HStack>
                            </Button>
                        </Box>
                    </Flex>
                </Flex>

                <SimpleGrid
                    columns={{ base: 1, md: 3 }}
                    gap={3}
                    px={{ base: 5, md: 6 }}
                    py={4}
                    bg="neutral.50"
                    borderTop="1px solid"
                    borderColor="neutral.200"
                >
                    <ProviderMeta icon={<FiBriefcase />} label={provider.company} />
                    <ProviderMeta icon={<FiMail />} label={provider.email} />
                    <ProviderMeta icon={<FiPhone />} label={provider.phone} />
                </SimpleGrid>
            </Box>

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
                        Review contact, banking, and legal information before saving.
                    </Text>
                </Box>

                <Box px={{ base: 5, md: 8 }} py={6}>
                    <VStack gap={8} align="stretch">
                        <Section title="Identity" description="Basic provider and company information.">
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

                        <Section title="Contact" description="How your team can reach this provider.">
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

                        <Section title="Banking" description="Payment information used by finance and accounting.">
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

                        <Section title="Legal And Tax" description="Registration identifiers required for compliance.">
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

                        {updateMutation.isError && (
                            <Box p={3} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="md">
                                <Typography variant="body-sm" color="error.600">
                                    Failed to update provider. Please review the form and try again.
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
                        Last updated: {new Date(provider.updatedAt).toLocaleDateString()}
                    </Text>

                    <Flex gap={3} justify={{ base: "stretch", md: "flex-end" }}>
                        <Box w={{ base: "full", md: "28" }}>
                            <Button
                                variant="secondary"
                                size="md"
                                type="button"
                                disabled={!isDirty || updateMutation.isPending}
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
                                disabled={updateMutation.isPending}
                                onClick={handleBack}
                            >
                                Cancel
                            </Button>
                        </Box>
                        <Box w={{ base: "full", md: "40" }}>
                            <Button
                                variant="primary"
                                size="md"
                                type="submit"
                                disabled={isSubmitting || updateMutation.isPending}
                            >
                                {updateMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </Box>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}

export default EditProviderPage
