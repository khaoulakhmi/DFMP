import { designationApi } from "@/api/designation.api"
import Button from "@/shared/components/atoms/button"
import Typography from "@/shared/components/atoms/typography"
import TextField from "@/shared/components/molecules/Forms/textField"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { CreateDesignationDTO } from "@/shared/types/designation.types"
import { Box, Flex, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const required = (label: string) => `${label} is required`

const CreateDesignationPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<CreateDesignationDTO>({
        mode: "onBlur",
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const createMutation = useMutation({
        mutationFn: designationApi.create,
        onSuccess: (designation) => {
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            toaster.create({
                title: "Designation created",
                description: `${designation.name} has been created successfully.`,
                type: "success",
            })
            navigate("/designations")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to create designation. Please try again.",
                type: "error",
            })
        },
    })

    const handleBack = () => {
        if (!isDirty || window.confirm("Discard this designation draft?")) {
            navigate("/designations")
        }
    }

    const onSubmit = (data: CreateDesignationDTO) => {
        createMutation.mutate({
            name: data.name.trim(),
            description: data.description.trim(),
        })
    }

    return (
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
                    Designation Details
                </Typography>
                <Text fontSize="xs" color="neutral.500" mt={1}>
                    Create a reusable category for products, lots, and specification rules.
                </Text>
            </Box>

            <Box px={{ base: 5, md: 8 }} py={6}>
                <VStack gap={5} align="stretch">
                    <TextField
                        label="Name"
                        placeholder="e.g. Premium Wheat"
                        error={errors.name?.message}
                        required
                        showRequiredIndicator
                        {...register("name", {
                            required: required("Designation name"),
                            minLength: {
                                value: 2,
                                message: "Designation name must be at least 2 characters",
                            },
                        })}
                    />
                    <TextField
                        label="Description"
                        placeholder="Short description used by the team"
                        error={errors.description?.message}
                        required
                        showRequiredIndicator
                        {...register("description", {
                            required: required("Description"),
                            minLength: {
                                value: 3,
                                message: "Description must be at least 3 characters",
                            },
                        })}
                    />

                    {createMutation.isError && (
                        <Box p={3} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="md">
                            <Typography variant="body-sm" color="error.600">
                                Failed to create designation. Please review the form and try again.
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
                    Designations can be edited after creation.
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
                            {createMutation.isPending ? "Creating..." : "Create Designation"}
                        </Button>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    )
}

export default CreateDesignationPage
