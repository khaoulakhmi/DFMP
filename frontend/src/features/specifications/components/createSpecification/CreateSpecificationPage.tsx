import { specificationApi } from "@/api/specification.api"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import { Box } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, type MouseEvent } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toSpecificationPayload } from "../specificationForm/specificationForm.utils"
import type { SpecificationForm, SpecificationFormField } from "../specificationForm/types"
import CreateSpecificationForm from "./CreateSpecificationForm"
import CreateSpecificationHeader from "./CreateSpecificationHeader"
import { buildCreateSpecificationSteps } from "./CreateSpecificationSteps"

const stepFields: SpecificationFormField[][] = [
    ["type", "designationId", "minAmount", "maxAmount", "year"],
    [],
    [],
    [],
]

const CreateSpecificationPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [activeStep, setActiveStep] = useState(0)

    const {
        register,
        handleSubmit,
        trigger,
        control,
        getValues,
        formState: { errors, isDirty },
    } = useForm<SpecificationForm>({
        mode: "onBlur",
        defaultValues: {
            type: "AO",
            designationId: "",
            year: new Date().getFullYear(),
            delayPeriodDays: 10,
            lotIds: [],
            avsStatus: "",
        },
    })

    const steps = useMemo(
        () => buildCreateSpecificationSteps({ control, errors, getValues, register }),
        [control, errors, getValues, register],
    )

    const createMutation = useMutation({
        mutationFn: specificationApi.create,
        onSuccess: (specification) => {
            queryClient.invalidateQueries({ queryKey: ["specifications"] })
            queryClient.invalidateQueries({ queryKey: ["lots"] })
            queryClient.invalidateQueries({ queryKey: ["designations"] })
            toaster.create({
                title: "Cahier de charge cree",
                description: `${specification.type} ${specification.year} a ete cree.`,
                type: "success",
            })
            navigate(`/specifications/${specification.id}`)
        },
        onError: () => {
            toaster.create({
                title: "Erreur",
                description: "Impossible de creer le cahier de charge.",
                type: "error",
            })
        },
    })

    const handleBack = () => {
        if (!isDirty || window.confirm("Discard this specification draft?")) {
            navigate("/specifications")
        }
    }

    const goNext = async () => {
        const fields = stepFields[activeStep]
        if (!fields) return

        const isValid = fields.length === 0 || await trigger(fields, { shouldFocus: true })
        if (isValid) setActiveStep(step => Math.min(step + 1, steps.length - 1))
    }

    const handleContinue = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        void goNext()
    }

    const goBack = () => {
        setActiveStep(step => Math.max(step - 1, 0))
    }

    const onSubmit = (data: SpecificationForm) => {
        if (activeStep !== steps.length - 1) {
            void goNext()
            return
        }

        createMutation.mutate(toSpecificationPayload(data))
    }

    return (
        <Box p={{ base: 4, md: 6 }}>
            <CreateSpecificationHeader onBack={handleBack} />
            <CreateSpecificationForm
                activeStep={activeStep}
                handleSubmit={handleSubmit}
                isPending={createMutation.isPending}
                onBack={handleBack}
                onContinue={handleContinue}
                onGoBack={goBack}
                onSubmit={onSubmit}
                steps={steps}
            />
        </Box>
    )
}

export default CreateSpecificationPage
