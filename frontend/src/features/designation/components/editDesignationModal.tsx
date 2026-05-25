import { designationApi } from "@/api/designation.api"
import Button from "@/shared/components/atoms/button"
import Typography from "@/shared/components/atoms/typography"
import TextField from "@/shared/components/molecules/Forms/textField"
import Modal from "@/shared/components/molecules/modal"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation, UpdateDesignationDTO } from "@/shared/types/designation.types"
import { Box, HStack, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

const required = (label: string) => `${label} is required`

interface EditDesignationModalProps {
    designation: Designation | null
    open: boolean
    onClose: () => void
}

const EditDesignationModal = ({ designation, open, onClose }: EditDesignationModalProps) => {
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<UpdateDesignationDTO>({
        mode: "onBlur",
        defaultValues: {
            name: "",
            description: "",
        },
    })

    useEffect(() => {
        if (!designation || !open) return

        reset({
            name: designation.name,
            description: designation.description ?? "",
        })
    }, [designation, open, reset])

    const updateMutation = useMutation({
        mutationFn: (data: UpdateDesignationDTO) =>
            designationApi.update(String(designation?.id), data),
        onSuccess: (updatedDesignation) => {
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            if (designation) {
                queryClient.invalidateQueries({ queryKey: ["designations", String(designation.id)] })
            }
            toaster.create({
                title: "Designation updated",
                description: `${updatedDesignation.name ?? designation?.name ?? "Designation"} has been updated successfully.`,
                type: "success",
            })
            onClose()
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to update designation. Please try again.",
                type: "error",
            })
        },
    })

    const handleClose = () => {
        if (!isDirty || window.confirm("Discard your designation changes?")) {
            onClose()
        }
    }

    const onSubmit = (data: UpdateDesignationDTO) => {
        if (!designation) return

        const payload: UpdateDesignationDTO = {}

        if (data.name !== undefined) payload.name = data.name.trim()
        if (data.description !== undefined) payload.description = data.description.trim()

        updateMutation.mutate(payload)
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Edit Designation"
            description="Update the category name and description."
            closeOnInteractOutside={!isDirty && !updateMutation.isPending}
            closeOnEscape={!updateMutation.isPending}
            footer={(
                <HStack gap={3} justify="flex-end" w="full" wrap="wrap">
                    <Box w={{ base: "full", sm: "32" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            disabled={updateMutation.isPending}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Box>
                    <Box w={{ base: "full", sm: "40" }}>
                        <Button
                            type="submit"
                            form="edit-designation-form"
                            variant="primary"
                            size="md"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </Box>
                </HStack>
            )}
        >
            <Box as="form" id="edit-designation-form" onSubmit={handleSubmit(onSubmit)}>
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
        </Modal>
    )
}

export default EditDesignationModal
