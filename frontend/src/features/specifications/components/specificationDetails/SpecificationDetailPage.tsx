import { designationApi } from "@/api/designation.api"
import { lotApi } from "@/api/lot.api"
import { specificationApi } from "@/api/specification.api"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import type { Specification, UpdateSpecificationDTO } from "@/shared/types/specification.types"
import { Box, Flex, Spinner, Text } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toFormValues, toUpdateSpecificationPayload } from "../specificationForm/specificationForm.utils"
import type { SpecificationForm } from "../specificationForm/types"
import SpecificationDetailHeader from "./SpecificationDetailHeader"
import SpecificationEditForm from "./SpecificationEditForm"
import SpecificationOverview from "./SpecificationOverview"

const SpecificationDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)

    const { data: specification, isLoading, isError } = useQuery<Specification>({
        queryKey: ["specifications", id],
        queryFn: () => specificationApi.getById(String(id)),
        enabled: Boolean(id),
    })

    const { data: designations = [] } = useQuery<Designation[]>({
        queryKey: ["designations"],
        queryFn: designationApi.getAll,
    })

    const { data: lots = [] } = useQuery<Lot[]>({
        queryKey: ["lots"],
        queryFn: lotApi.getAll,
    })

    const {
        register,
        handleSubmit,
        reset,
        control,
        getValues,
        formState: { errors, isDirty },
    } = useForm<SpecificationForm>({
        mode: "onBlur",
    })

    useEffect(() => {
        if (specification) reset(toFormValues(specification))
    }, [reset, specification])

    const selectedDesignationId = Number(useWatch({ control, name: "designationId" }))
    const availableLots = useMemo(
        () => lots.filter(lot => lot.designationId === selectedDesignationId),
        [lots, selectedDesignationId],
    )

    const updateMutation = useMutation({
        mutationFn: (payload: UpdateSpecificationDTO) => specificationApi.update(String(id), payload),
        onSuccess: (updatedSpecification) => {
            queryClient.setQueryData(["specifications", id], updatedSpecification)
            queryClient.invalidateQueries({ queryKey: ["specifications"] })
            queryClient.invalidateQueries({ queryKey: ["lots"] })
            toaster.create({
                title: "Cahier de charge modifie",
                description: `${updatedSpecification.type} ${updatedSpecification.year} a ete mis a jour.`,
                type: "success",
            })
            setIsEditing(false)
        },
        onError: () => {
            toaster.create({
                title: "Erreur",
                description: "Impossible de modifier le cahier de charge.",
                type: "error",
            })
        },
    })

    if (isLoading) {
        return <Flex h="64" align="center" justify="center"><Spinner color="primary.500" /></Flex>
    }

    if (isError || !specification) {
        return <Box p={6} bg="error.50" borderRadius="xl"><Text color="error.600">Cahier de charge introuvable.</Text></Box>
    }

    const handleCancelEdit = () => {
        if (!isDirty || window.confirm("Discard specification changes?")) {
            reset(toFormValues(specification))
            setIsEditing(false)
        }
    }

    const onSubmit = (data: SpecificationForm) => {
        updateMutation.mutate(toUpdateSpecificationPayload(data))
    }

    return (
        <Box p={{ base: 4, md: 6 }}>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Specifications", href: "/specifications" },
                    { label: `${specification.type} ${specification.year}`, isCurrentPage: true },
                ]}
            />

            <SpecificationDetailHeader
                isEditing={isEditing}
                specification={specification}
                onBack={() => navigate("/specifications")}
                onEdit={() => setIsEditing(true)}
            />

            {isEditing ? (
                <SpecificationEditForm
                    availableLots={availableLots}
                    designations={designations}
                    errors={errors}
                    getValues={getValues}
                    handleSubmit={handleSubmit}
                    isPending={updateMutation.isPending}
                    onCancel={handleCancelEdit}
                    onSubmit={onSubmit}
                    register={register}
                />
            ) : (
                <SpecificationOverview specification={specification} />
            )}
        </Box>
    )
}

export default SpecificationDetailPage
