import { designationApi } from "@/api/designation.api"
import { lotApi } from "@/api/lot.api"
import { specificationApi } from "@/api/specification.api"
import Button from "@/shared/components/atoms/button"
import Stepper, { type StepperItem } from "@/shared/components/molecules/stepper"
import TextField from "@/shared/components/molecules/Forms/textField"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import { AVSStatus, type CreateSpecificationDTO } from "@/shared/types/specification.types"
import { Box, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, type MouseEvent, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiFileText, FiGlobe, FiSave } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { optionalDate, optionalString } from "./specification.utils"

const required = (label: string) => `${label} is required`

type SpecificationForm = {
    type: string
    designationId: string
    minAmount: number
    maxAmount: number
    year: number
    depositDateCM: string
    sessionDate: string
    visaDate: string
    visaNumber: string
    pubArabicDate: string
    pubArabicJournal: string
    pubFrenchDate: string
    pubFrenchJournal: string
    pubArElecJournal: string
    pubFrElecJournal: string
    lotIds: string[]
    openingDate: string
    techEvalDate: string
    finEvalDate: string
    attributionDate: string
    delayPeriodDays: number
    appealDate: string
    appealDepositDate: string
    appealResult: string
    programmingDate: string
    avsStatus: "" | AVSStatus
}

type FieldName = keyof SpecificationForm

const stepFields: FieldName[][] = [
    ["type", "designationId", "minAmount", "maxAmount", "year"],
    [],
    [],
    [],
]

const Section = ({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: ReactNode
}) => (
    <Box>
        <Box mb={4}>
            <Text fontSize="sm" fontWeight="semibold" color="neutral.900">{title}</Text>
            <Text fontSize="xs" color="neutral.500" mt={1}>{description}</Text>
        </Box>
        {children}
    </Box>
)

const CreateSpecificationPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [activeStep, setActiveStep] = useState(0)

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors, isDirty },
    } = useForm<SpecificationForm>({
        mode: "onBlur",
        defaultValues: {
            type: "Appel d'offres",
            designationId: "",
            year: new Date().getFullYear(),
            delayPeriodDays: 10,
            lotIds: [],
            avsStatus: "",
        },
    })

    const selectedDesignationId = Number(watch("designationId"))

    const { data: designations = [], isLoading: isLoadingDesignations } = useQuery<Designation[]>({
        queryKey: ["designations"],
        queryFn: designationApi.getAll,
    })

    const { data: lots = [], isLoading: isLoadingLots } = useQuery<Lot[]>({
        queryKey: ["lots"],
        queryFn: lotApi.getAll,
    })

    const availableLots = useMemo(
        () => lots.filter(lot => lot.designationId === selectedDesignationId),
        [lots, selectedDesignationId],
    )

    const createMutation = useMutation({
        mutationFn: specificationApi.create,
        onSuccess: (specification) => {
            queryClient.invalidateQueries({ queryKey: ["specifications"] })
            queryClient.invalidateQueries({ queryKey: ["lots"] })
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

        const payload: CreateSpecificationDTO = {
            type: data.type.trim(),
            designationId: Number(data.designationId),
            minAmount: Number(data.minAmount),
            maxAmount: Number(data.maxAmount),
            year: Number(data.year),
            depositDateCM: optionalDate(data.depositDateCM),
            sessionDate: optionalDate(data.sessionDate),
            visaDate: optionalDate(data.visaDate),
            visaNumber: optionalString(data.visaNumber),
            pubArabicDate: optionalDate(data.pubArabicDate),
            pubArabicJournal: optionalString(data.pubArabicJournal),
            pubFrenchDate: optionalDate(data.pubFrenchDate),
            pubFrenchJournal: optionalString(data.pubFrenchJournal),
            pubArElecJournal: optionalString(data.pubArElecJournal),
            pubFrElecJournal: optionalString(data.pubFrElecJournal),
            lotIds: data.lotIds?.map(Number) ?? [],
            tendering: {
                openingDate: optionalDate(data.openingDate),
                techEvalDate: optionalDate(data.techEvalDate),
                finEvalDate: optionalDate(data.finEvalDate),
                attributionDate: optionalDate(data.attributionDate),
                delayPeriodDays: Number(data.delayPeriodDays || 10),
                appealDate: optionalDate(data.appealDate),
                appealDepositDate: optionalDate(data.appealDepositDate),
                appealResult: optionalString(data.appealResult),
                programmingDate: optionalDate(data.programmingDate),
                avsStatus: data.avsStatus || null,
            },
        }

        createMutation.mutate(payload)
    }

    const steps: StepperItem[] = useMemo(() => [
        {
            title: "General",
            description: "Procedure and amounts",
            icon: <FiFileText />,
            content: (
                <Section title="Informations generales" description="Type de procedure, designation concernee et enveloppe financiere.">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <TextField
                            label="Type"
                            placeholder="Appel d'offres"
                            error={errors.type?.message}
                            required
                            showRequiredIndicator
                            {...register("type", { required: required("Type"), minLength: { value: 2, message: "Type must be at least 2 characters" } })}
                        />
                        <SelectField
                            label="Designation"
                            error={errors.designationId?.message}
                            required
                            showRequiredIndicator
                            {...register("designationId", { required: required("Designation"), validate: value => Number(value) > 0 || "Select a designation" })}
                        >
                            <option value="">Select designation</option>
                            {designations.map(designation => (
                                <option key={designation.id} value={designation.id}>{designation.name}</option>
                            ))}
                        </SelectField>
                        <TextField
                            label="Montant min"
                            type="number"
                            inputMode="decimal"
                            error={errors.minAmount?.message}
                            required
                            showRequiredIndicator
                            {...register("minAmount", { required: required("Montant min"), valueAsNumber: true, min: { value: 0, message: "Montant min must be positive" } })}
                        />
                        <TextField
                            label="Montant max"
                            type="number"
                            inputMode="decimal"
                            error={errors.maxAmount?.message}
                            required
                            showRequiredIndicator
                            {...register("maxAmount", {
                                required: required("Montant max"),
                                valueAsNumber: true,
                                min: { value: 0, message: "Montant max must be positive" },
                                validate: value => value >= Number(watch("minAmount") || 0) || "Montant max must be greater than min",
                            })}
                        />
                        <TextField
                            label="Annee"
                            type="number"
                            error={errors.year?.message}
                            required
                            showRequiredIndicator
                            {...register("year", { required: required("Annee"), valueAsNumber: true, min: { value: 2000, message: "Year is too old" } })}
                        />
                    </SimpleGrid>
                </Section>
            ),
        },
        {
            title: "Depot & visa",
            description: "C.M. and visa dates",
            icon: <FiCalendar />,
            content: (
                <Section title="Depot et visa" description="Suivi interne du depot C.M., seance et visa.">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <TextField label="Date depot C.M." type="date" {...register("depositDateCM")} />
                        <TextField label="Date seance" type="date" {...register("sessionDate")} />
                        <TextField label="Date visa" type="date" {...register("visaDate")} />
                        <TextField label="N° Visa" placeholder="VIS-2026-001" {...register("visaNumber")} />
                    </SimpleGrid>
                </Section>
            ),
        },
        {
            title: "Publicite",
            description: "Journals and linked lots",
            icon: <FiGlobe />,
            content: (
                <VStack gap={8} align="stretch">
                    <Section title="Publicite" description="Journaux papier et electroniques en arabe et francais.">
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <TextField label="Date publication arabe" type="date" {...register("pubArabicDate")} />
                            <TextField label="Journal arabe" placeholder="Nom du journal" {...register("pubArabicJournal")} />
                            <TextField label="Date publication francaise" type="date" {...register("pubFrenchDate")} />
                            <TextField label="Journal francais" placeholder="Nom du journal" {...register("pubFrenchJournal")} />
                            <TextField label="Journal electronique arabe" placeholder="Plateforme / journal" {...register("pubArElecJournal")} />
                            <TextField label="Journal electronique francais" placeholder="Plateforme / journal" {...register("pubFrElecJournal")} />
                        </SimpleGrid>
                    </Section>

                    <Section title="Lots concernes" description="Lots lies au meme designation que le cahier de charge.">
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                            {availableLots.length > 0 ? availableLots.map(lot => (
                                <Box
                                    key={lot.id}
                                    as="label"
                                    display="flex"
                                    alignItems="center"
                                    gap={3}
                                    p={3}
                                    border="1px solid"
                                    borderColor="neutral.200"
                                    borderRadius="md"
                                    cursor="pointer"
                                >
                                    <input type="checkbox" value={lot.id} {...register("lotIds")} />
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" color="neutral.800">{lot.name}</Text>
                                        <Text fontSize="xs" color="neutral.500">{lot.products?.length ?? 0} products</Text>
                                    </Box>
                                </Box>
                            )) : (
                                <Box p={4} bg="neutral.50" borderRadius="md">
                                    <Text fontSize="sm" color="neutral.500">Select a designation with available lots.</Text>
                                </Box>
                            )}
                        </SimpleGrid>
                    </Section>
                </VStack>
            ),
        },
        {
            title: "Evaluation",
            description: "Attribution and appeals",
            icon: <FiCheckCircle />,
            content: (
                <Section title="Evaluation et attribution" description="Dates d'ouverture, evaluation technique/financiere, attribution, recours et A.V.S.">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <TextField label="Date ouverture" type="date" {...register("openingDate")} />
                        <TextField label="Evaluation technique" type="date" {...register("techEvalDate")} />
                        <TextField label="Evaluation financiere" type="date" {...register("finEvalDate")} />
                        <TextField label="Date attribution" type="date" {...register("attributionDate")} />
                        <TextField label="Delai recours (jours)" type="number" {...register("delayPeriodDays", { valueAsNumber: true })} />
                        <TextField label="Date recours" type="date" {...register("appealDate")} />
                        <TextField label="Depot recours" type="date" {...register("appealDepositDate")} />
                        <TextField label="Resultat recours" placeholder="OK / Observation" {...register("appealResult")} />
                        <TextField label="Date programmation" type="date" {...register("programmingDate")} />
                        <SelectField label="A.V.S." {...register("avsStatus")}>
                            <option value="">Non renseigne</option>
                            <option value={AVSStatus.FONDU}>Fondu</option>
                            <option value={AVSStatus.NON_FONDU}>Non fondu</option>
                        </SelectField>
                    </SimpleGrid>
                </Section>
            ),
        },
    ], [availableLots, designations, errors, register, watch])

    if (isLoadingDesignations || isLoadingLots) {
        return <Flex h="64" align="center" justify="center"><Spinner color="primary.500" /></Flex>
    }

    return (
        <Box p={{ base: 4, md: 6 }}>
            <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} mb={5}>
                <Box>
                    <Text fontSize="lg" fontWeight="semibold" color="neutral.900">Nouveau cahier de charge</Text>
                    <Text fontSize="sm" color="neutral.500">Renseignez les montants, visas, publications et etapes d'appel d'offres.</Text>
                </Box>
                <Box w={{ base: "full", sm: "36" }}>
                    <Button type="button" variant="secondary" onClick={handleBack}>
                        <HStack justify="center"><FiArrowLeft /><Text>Back</Text></HStack>
                    </Button>
                </Box>
            </Flex>

            <Box
                as="form"
                bg="white"
                border="1px solid"
                borderColor="neutral.200"
                borderRadius="xl"
                boxShadow="sm"
                overflow="hidden"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box px={{ base: 5, md: 8 }} py={5} bg="neutral.50" borderBottom="1px solid" borderColor="neutral.200">
                    <Text fontSize="sm" fontWeight="semibold" color="neutral.800">Specification administrative</Text>
                    <Text fontSize="xs" color="neutral.500" mt={1}>All schema fields for Specifications and Tendering are available here.</Text>
                </Box>

                <Box px={{ base: 5, md: 8 }} py={6}>
                    <Stepper
                        key={activeStep}
                        steps={steps}
                        defaultStep={activeStep}
                        showControls={false}
                        size="sm"
                        shape="circle"
                        contentProps={{
                            border: "0",
                            boxShadow: "none",
                            p: 0,
                            mt: 6,
                        }}
                    />
                </Box>

                <Flex justify="space-between" gap={3} px={{ base: 5, md: 8 }} py={5} bg="neutral.50" borderTop="1px solid" borderColor="neutral.200" wrap="wrap">
                    <Box w={{ base: "full", sm: "32" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={createMutation.isPending}
                            onClick={activeStep === 0 ? handleBack : goBack}
                        >
                            {activeStep === 0 ? "Cancel" : "Back"}
                        </Button>
                    </Box>
                    <HStack gap={3} justify="flex-end" flex="1">
                        <Box w={{ base: "full", sm: activeStep === steps.length - 1 ? "48" : "32" }}>
                            {activeStep === steps.length - 1 ? (
                                <Button type="submit" disabled={createMutation.isPending}>
                                    <HStack justify="center"><FiSave /><Text>{createMutation.isPending ? "Creating..." : "Create specification"}</Text></HStack>
                                </Button>
                            ) : (
                                <Button type="button" disabled={createMutation.isPending} onClick={handleContinue}>
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

export default CreateSpecificationPage
