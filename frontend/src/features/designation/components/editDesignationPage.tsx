import { designationApi } from "@/api/designation.api"
import Button from "@/shared/components/atoms/button"
import Typography from "@/shared/components/atoms/typography"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import TextField from "@/shared/components/molecules/Forms/textField"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { UpdateDesignationDTO } from "@/shared/types/designation.types"
import { Box, Flex, HStack, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FiArrowLeft, FiTrash2 } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"

const required = (label: string) => `${label} is required`

const EditDesignationPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<UpdateDesignationDTO>({
        mode: "onBlur",
    })

    const { data: designation, isLoading, isError } = useQuery({
        queryKey: ["designations", id],
        queryFn: () => designationApi.getById(id!),
        enabled: Boolean(id),
    })

    useEffect(() => {
        if (!designation) return

        reset({
            name: designation.name,
            description: designation.description ?? "",
        })
    }, [designation, reset])

    const updateMutation = useMutation({
        mutationFn: (data: UpdateDesignationDTO) => designationApi.update(id!, data),
        onSuccess: (updatedDesignation) => {
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            queryClient.invalidateQueries({ queryKey: ["designations", id] })
            toaster.create({
                title: "Designation updated",
                description: `${updatedDesignation.name ?? designation?.name ?? "Designation"} has been updated successfully.`,
                type: "success",
            })
            navigate("/designations")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to update designation. Please try again.",
                type: "error",
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: () => designationApi.delete(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            toaster.create({
                title: "Designation deleted",
                description: `${designation?.name ?? "Designation"} has been deleted.`,
                type: "success",
            })
            navigate("/designations")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to delete designation. Please try again.",
                type: "error",
            })
        },
    })

    const handleBack = () => {
        if (!isDirty || window.confirm("Discard your designation changes?")) {
            navigate("/designations")
        }
    }

    const onSubmit = (data: UpdateDesignationDTO) => {
        const payload: UpdateDesignationDTO = {}

        if (data.name !== undefined) payload.name = data.name.trim()
        if (data.description !== undefined) payload.description = data.description.trim()

        updateMutation.mutate(payload)
    }

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="64" bg="white" borderRadius="xl" border="1px solid" borderColor="neutral.200">
                <VStack gap={3}>
                    <Spinner color="primary.500" />
                    <Text fontSize="sm" color="neutral.500">Loading designation...</Text>
                </VStack>
            </Flex>
        )
    }

    if (isError || !designation) {
        return (
            <Box p={6} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl">
                <Text color="error.600" fontSize="sm" fontWeight="medium">
                    Designation not found or failed to load.
                </Text>
                <Box w="28" mt={4}>
                    <Button variant="secondary" size="sm" onClick={() => navigate("/designations")}>
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
                    { label: "Designations", href: "/designations" },
                    { label: "Edit Designation", isCurrentPage: true },
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
                    bg="neutral.50"
                >
                    <Box minW="0">
                        <HStack gap={2} mb={1} wrap="wrap">
                            <Text fontSize="xs" color="primary.700" fontWeight="semibold" textTransform="uppercase">
                                Designation Record
                            </Text>
                            {isDirty && (
                                <Text px={2} py={0.5} bg="warning.50" color="warning.700" borderRadius="full" fontSize="xs" fontWeight="semibold">
                                    Unsaved changes
                                </Text>
                            )}
                        </HStack>
                        <Typography variant="heading">
                            Edit {designation.name}
                        </Typography>
                        <Text color="neutral.600" fontSize="sm" mt={1}>
                            Review this category before it is used by products, lots, and specifications.
                        </Text>
                    </Box>

                    <Flex gap={3} justify={{ base: "stretch", sm: "flex-end" }} wrap="wrap">
                        <Box w={{ base: "full", sm: "32" }}>
                            <Button variant="secondary" size="md" type="button" onClick={handleBack}>
                                <HStack gap={2} justify="center">
                                    <FiArrowLeft />
                                    <Text as="span">Back</Text>
                                </HStack>
                            </Button>
                        </Box>
                        <Box w={{ base: "full", sm: "48" }}>
                            <Button
                                variant="danger"
                                size="md"
                                type="button"
                                disabled={deleteMutation.isPending || updateMutation.isPending}
                                onClick={() => {
                                    if (window.confirm(`Delete ${designation.name}? This cannot be undone.`)) {
                                        deleteMutation.mutate()
                                    }
                                }}
                            >
                                <HStack gap={2} justify="center">
                                    <FiTrash2 />
                                    <Text as="span">{deleteMutation.isPending ? "Deleting..." : "Delete Designation"}</Text>
                                </HStack>
                            </Button>
                        </Box>
                    </Flex>
                </Flex>
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
                        Designation Details
                    </Typography>
                    <Text fontSize="xs" color="neutral.500" mt={1}>
                        Keep the name clear so it remains easy to find in operational workflows.
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

                        {updateMutation.isError && (
                            <Box p={3} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="md">
                                <Typography variant="body-sm" color="error.600">
                                    Failed to update designation. Please review the form and try again.
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
                        Changes are reflected in related designation lists after saving.
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

export default EditDesignationPage
