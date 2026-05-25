import { lotApi } from "@/api/lot.api"
import Button from "@/shared/components/atoms/button"
import TextField from "@/shared/components/molecules/Forms/textField"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import Modal from "@/shared/components/molecules/modal"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import type { CreateLotDTO } from "@/shared/types/lot.types"
import { Box, HStack, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

const required = (label: string) => `${label} is required`

type LotForm = {
    name: string
    designationId: string
}

interface CreateLotModalProps {
    open: boolean
    onClose: () => void
    designations: Designation[]
    defaultDesignationId?: number | null
}

const CreateLotModal = ({ open, onClose, designations, defaultDesignationId }: CreateLotModalProps) => {
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<LotForm>({
        mode: "onBlur",
        defaultValues: {
            name: "",
            designationId: defaultDesignationId ? String(defaultDesignationId) : "",
        },
    })

    useEffect(() => {
        if (open) {
            reset({
                name: "",
                designationId: defaultDesignationId ? String(defaultDesignationId) : "",
            })
        }
    }, [defaultDesignationId, open, reset])

    const createMutation = useMutation({
        mutationFn: lotApi.create,
        onSuccess: (lot) => {
            queryClient.invalidateQueries({ queryKey: ["lots"] })
            toaster.create({
                title: "Lot created",
                description: `${lot.name} has been created successfully.`,
                type: "success",
            })
            onClose()
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to create lot. Please try again.",
                type: "error",
            })
        },
    })

    const handleClose = () => {
        if (!isDirty || window.confirm("Discard this lot draft?")) onClose()
    }

    const onSubmit = (data: LotForm) => {
        const payload: CreateLotDTO = {
            name: data.name.trim(),
            designationId: Number(data.designationId),
        }
        createMutation.mutate(payload)
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Add Lot"
            description="Create a lot under a designation."
            closeOnInteractOutside={!isDirty && !createMutation.isPending}
            closeOnEscape={!createMutation.isPending}
            footer={(
                <HStack gap={3} justify="flex-end" w="full" wrap="wrap">
                    <Box w={{ base: "full", sm: "32" }}>
                        <Button type="button" variant="secondary" disabled={createMutation.isPending} onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                    <Box w={{ base: "full", sm: "36" }}>
                        <Button type="submit" form="create-lot-form" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Creating..." : "Create Lot"}
                        </Button>
                    </Box>
                </HStack>
            )}
        >
            <Box as="form" id="create-lot-form" onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={5} align="stretch">
                    <TextField
                        label="Lot name"
                        placeholder="e.g. Lot 02 - Produits laitiers"
                        error={errors.name?.message}
                        required
                        showRequiredIndicator
                        {...register("name", {
                            required: required("Lot name"),
                            minLength: { value: 2, message: "Lot name must be at least 2 characters" },
                        })}
                    />
                    <SelectField
                        label="Designation"
                        error={errors.designationId?.message}
                        required
                        showRequiredIndicator
                        {...register("designationId", {
                            required: required("Designation"),
                            validate: value => Number(value) > 0 || "Select a designation",
                        })}
                    >
                        <option value="">Select designation</option>
                        {designations.map(designation => (
                            <option key={designation.id} value={designation.id}>{designation.name}</option>
                        ))}
                    </SelectField>
                </VStack>
            </Box>
        </Modal>
    )
}

export default CreateLotModal
