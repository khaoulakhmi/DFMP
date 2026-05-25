import { designationApi } from "@/api/designation.api"
import Button from "@/shared/components/atoms/button"
import Typography from "@/shared/components/atoms/typography"
import TextField from "@/shared/components/molecules/Forms/textField"
import Modal from "@/shared/components/molecules/modal"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { CreateDesignationDTO } from "@/shared/types/designation.types"
import { Box, HStack, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

const required = (label: string) => `${label} is required`

interface CreateDesignationModalProps {
    open: boolean
    onClose: () => void
}

const CreateDesignationModal = ({ open, onClose }: CreateDesignationModalProps) => {
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

    useEffect(() => {
        if (!open) reset()
    }, [open, reset])

    const createMutation = useMutation({
        mutationFn: designationApi.create,
        onSuccess: (designation) => {
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            toaster.create({
                title: "Designation created",
                description: `${designation.name} has been created successfully.`,
                type: "success",
            })
            onClose()
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to create designation. Please try again.",
                type: "error",
            })
        },
    })

    const handleClose = () => {
        if (!isDirty || window.confirm("Discard this designation draft?")) {
            onClose()
        }
    }

    const onSubmit = (data: CreateDesignationDTO) => {
        createMutation.mutate({
            name: data.name.trim(),
            description: data.description.trim(),
        })
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Add Designation"
            description="Create a reusable category for products, lots, and specification rules."
            closeOnInteractOutside={!isDirty && !createMutation.isPending}
            closeOnEscape={!createMutation.isPending}
            footer={(
                <HStack gap={3} justify="flex-end" w="full" wrap="wrap">
                    <Box w={{ base: "full", sm: "32" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            disabled={createMutation.isPending}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Box>
                    <Box w={{ base: "full", sm: "44" }}>
                        <Button
                            type="submit"
                            form="create-designation-form"
                            variant="primary"
                            size="md"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? "Creating..." : "Create Designation"}
                        </Button>
                    </Box>
                </HStack>
            )}
        >
            <Box as="form" id="create-designation-form" onSubmit={handleSubmit(onSubmit)}>
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
        </Modal>
    )
}

export default CreateDesignationModal
