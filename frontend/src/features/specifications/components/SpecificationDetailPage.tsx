import { designationApi } from "@/api/designation.api"
import { lotApi } from "@/api/lot.api"
import { specificationApi } from "@/api/specification.api"
import Badge from "@/shared/components/atoms/badge"
import Button from "@/shared/components/atoms/button"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import TextField from "@/shared/components/molecules/Forms/textField"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import { AVSStatus, type Specification, type UpdateSpecificationDTO } from "@/shared/types/specification.types"
import { Box, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiEdit2, FiFileText, FiGrid, FiLayers, FiSave, FiX } from "react-icons/fi"
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom"
import { formatDate, formatMoney, optionalDate, optionalString } from "./specification.utils"

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

const toInputDate = (value?: string | null) => {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toISOString().slice(0, 10)
}

const toFormValues = (specification: Specification): SpecificationForm => ({
    type: specification.type,
    designationId: String(specification.designationId),
    minAmount: specification.minAmount,
    maxAmount: specification.maxAmount,
    year: specification.year,
    depositDateCM: toInputDate(specification.depositDateCM),
    sessionDate: toInputDate(specification.sessionDate),
    visaDate: toInputDate(specification.visaDate),
    visaNumber: specification.visaNumber ?? "",
    pubArabicDate: toInputDate(specification.pubArabicDate),
    pubArabicJournal: specification.pubArabicJournal ?? "",
    pubFrenchDate: toInputDate(specification.pubFrenchDate),
    pubFrenchJournal: specification.pubFrenchJournal ?? "",
    pubArElecJournal: specification.pubArElecJournal ?? "",
    pubFrElecJournal: specification.pubFrElecJournal ?? "",
    lotIds: specification.lots?.map(lot => String(lot.id)) ?? [],
    openingDate: toInputDate(specification.tendering?.openingDate),
    techEvalDate: toInputDate(specification.tendering?.techEvalDate),
    finEvalDate: toInputDate(specification.tendering?.finEvalDate),
    attributionDate: toInputDate(specification.tendering?.attributionDate),
    delayPeriodDays: specification.tendering?.delayPeriodDays ?? 10,
    appealDate: toInputDate(specification.tendering?.appealDate),
    appealDepositDate: toInputDate(specification.tendering?.appealDepositDate),
    appealResult: specification.tendering?.appealResult ?? "",
    programmingDate: toInputDate(specification.tendering?.programmingDate),
    avsStatus: specification.tendering?.avsStatus ?? "",
})

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box>
        <Text fontSize="xs" color="neutral.500" mb={1}>{label}</Text>
        <Text fontSize="sm" fontWeight="semibold" color="neutral.900">{value}</Text>
    </Box>
)

const Section = ({
    title,
    icon,
    children,
}: {
    title: string
    icon: React.ReactElement
    children: React.ReactNode
}) => (
    <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="xl" overflow="hidden" boxShadow="sm">
        <HStack gap={2} px={5} py={4} bg="neutral.50" borderBottom="1px solid" borderColor="neutral.200">
            <Box color="primary.600">{icon}</Box>
            <Text fontSize="sm" fontWeight="semibold" color="neutral.800">{title}</Text>
        </HStack>
        <Box p={5}>{children}</Box>
    </Box>
)

const TimelineItem = ({ label, value, done }: { label: string; value?: string | null | undefined; done: boolean }) => (
    <HStack align="flex-start" gap={3}>
        <Flex
            w="8"
            h="8"
            align="center"
            justify="center"
            bg={done ? "success.50" : "neutral.100"}
            color={done ? "success.700" : "neutral.500"}
            borderRadius="full"
            flexShrink={0}
        >
            {done ? <FiCheckCircle /> : <FiCalendar />}
        </Flex>
        <Box>
            <Text fontSize="sm" fontWeight="semibold" color="neutral.800">{label}</Text>
            <Text fontSize="xs" color="neutral.500">{formatDate(value)}</Text>
        </Box>
    </HStack>
)

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
        watch,
        formState: { errors, isDirty },
    } = useForm<SpecificationForm>({
        mode: "onBlur",
    })

    useEffect(() => {
        if (specification) reset(toFormValues(specification))
    }, [reset, specification])

    const selectedDesignationId = Number(watch("designationId"))
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

    const tendering = specification.tendering
    const timeline = [
        ["Depot C.M.", specification.depositDateCM],
        ["Seance", specification.sessionDate],
        ["Visa", specification.visaDate],
        ["Ouverture", tendering?.openingDate],
        ["Evaluation technique", tendering?.techEvalDate],
        ["Evaluation financiere", tendering?.finEvalDate],
        ["Attribution", tendering?.attributionDate],
        ["Recours", tendering?.appealDate],
        ["Programmation", tendering?.programmingDate],
    ] as const

    const handleCancelEdit = () => {
        if (!isDirty || window.confirm("Discard specification changes?")) {
            reset(toFormValues(specification))
            setIsEditing(false)
        }
    }

    const onSubmit = (data: SpecificationForm) => {
        const payload: UpdateSpecificationDTO = {
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

        updateMutation.mutate(payload)
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

            <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} mb={5}>
                <HStack gap={4} align="flex-start">
                    <Flex w="12" h="12" align="center" justify="center" bg="primary.50" color="primary.700" borderRadius="md">
                        <FiFileText size={24} />
                    </Flex>
                    <Box>
                        <HStack gap={2} wrap="wrap">
                            <Text fontSize="lg" fontWeight="bold" color="neutral.900">{specification.type}</Text>
                            <Badge label={String(specification.year)} variant="accent" tone="subtle" />
                        </HStack>
                        <Text fontSize="sm" color="neutral.600">
                            {specification.designation?.name ?? `Designation ${specification.designationId}`}
                        </Text>
                    </Box>
                </HStack>
                <HStack gap={3} justify={{ base: "stretch", sm: "flex-end" }} wrap="wrap">
                    <Box w={{ base: "full", sm: "36" }}>
                        <Button type="button" variant="secondary" onClick={() => navigate("/specifications")}>
                            <HStack justify="center"><FiArrowLeft /><Text>Back</Text></HStack>
                        </Button>
                    </Box>
                    {!isEditing && (
                        <Box w={{ base: "full", sm: "36" }}>
                            <Button type="button" onClick={() => setIsEditing(true)}>
                                <HStack justify="center"><FiEdit2 /><Text>Edit</Text></HStack>
                            </Button>
                        </Box>
                    )}
                </HStack>
            </Flex>

            {isEditing ? (
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
                        <Text fontSize="sm" fontWeight="semibold" color="neutral.800">Modifier le cahier de charge</Text>
                        <Text fontSize="xs" color="neutral.500" mt={1}>Update administrative, publicity, lot, and tendering information.</Text>
                    </Box>

                    <VStack gap={8} align="stretch" px={{ base: 5, md: 8 }} py={6}>
                        <Section title="Informations generales" icon={<FiFileText />}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                <TextField
                                    label="Type"
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

                        <Section title="Depot et visa" icon={<FiCalendar />}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                <TextField label="Date depot C.M." type="date" {...register("depositDateCM")} />
                                <TextField label="Date seance" type="date" {...register("sessionDate")} />
                                <TextField label="Date visa" type="date" {...register("visaDate")} />
                                <TextField label="N° Visa" placeholder="VIS-2026-001" {...register("visaNumber")} />
                            </SimpleGrid>
                        </Section>

                        <Section title="Publicite" icon={<FiFileText />}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                <TextField label="Date publication arabe" type="date" {...register("pubArabicDate")} />
                                <TextField label="Journal arabe" placeholder="Nom du journal" {...register("pubArabicJournal")} />
                                <TextField label="Date publication francaise" type="date" {...register("pubFrenchDate")} />
                                <TextField label="Journal francais" placeholder="Nom du journal" {...register("pubFrenchJournal")} />
                                <TextField label="Journal electronique arabe" placeholder="Plateforme / journal" {...register("pubArElecJournal")} />
                                <TextField label="Journal electronique francais" placeholder="Plateforme / journal" {...register("pubFrElecJournal")} />
                            </SimpleGrid>
                        </Section>

                        <Section title="Lots associes" icon={<FiLayers />}>
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

                        <Section title="Evaluation, attribution et recours" icon={<FiCheckCircle />}>
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
                    </VStack>

                    <Flex justify="flex-end" gap={3} px={{ base: 5, md: 8 }} py={5} bg="neutral.50" borderTop="1px solid" borderColor="neutral.200" wrap="wrap">
                        <Box w={{ base: "full", sm: "32" }}>
                            <Button type="button" variant="secondary" disabled={updateMutation.isPending} onClick={handleCancelEdit}>
                                <HStack justify="center"><FiX /><Text>Cancel</Text></HStack>
                            </Button>
                        </Box>
                        <Box w={{ base: "full", sm: "44" }}>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                <HStack justify="center"><FiSave /><Text>{updateMutation.isPending ? "Saving..." : "Save changes"}</Text></HStack>
                            </Button>
                        </Box>
                    </Flex>
                </Box>
            ) : (
            <>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap={3} mb={5}>
                <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4}>
                    <InfoItem label="Montant min" value={formatMoney(specification.minAmount)} />
                </Box>
                <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4}>
                    <InfoItem label="Montant max" value={formatMoney(specification.maxAmount)} />
                </Box>
                <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4}>
                    <InfoItem label="N° Visa" value={specification.visaNumber ?? "-"} />
                </Box>
                <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="lg" p={4}>
                    <InfoItem label="Lots" value={`${specification.lots?.length ?? 0} associes`} />
                </Box>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                <Section title="Chronologie administrative" icon={<FiCalendar />}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                        {timeline.map(([label, value]) => (
                            <TimelineItem key={label} label={label} value={value} done={Boolean(value)} />
                        ))}
                    </SimpleGrid>
                </Section>

                <Section title="Publicite" icon={<FiFileText />}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <InfoItem label="Publication arabe" value={formatDate(specification.pubArabicDate)} />
                        <InfoItem label="Journal arabe" value={specification.pubArabicJournal ?? "-"} />
                        <InfoItem label="Publication francaise" value={formatDate(specification.pubFrenchDate)} />
                        <InfoItem label="Journal francais" value={specification.pubFrenchJournal ?? "-"} />
                        <InfoItem label="Journal electronique arabe" value={specification.pubArElecJournal ?? "-"} />
                        <InfoItem label="Journal electronique francais" value={specification.pubFrElecJournal ?? "-"} />
                    </SimpleGrid>
                </Section>

                <Section title="Evaluation, attribution et recours" icon={<FiCheckCircle />}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <InfoItem label="Date ouverture" value={formatDate(tendering?.openingDate)} />
                        <InfoItem label="Evaluation technique" value={formatDate(tendering?.techEvalDate)} />
                        <InfoItem label="Evaluation financiere" value={formatDate(tendering?.finEvalDate)} />
                        <InfoItem label="Attribution" value={formatDate(tendering?.attributionDate)} />
                        <InfoItem label="Delai recours" value={`${tendering?.delayPeriodDays ?? 10} jours`} />
                        <InfoItem label="Date recours" value={formatDate(tendering?.appealDate)} />
                        <InfoItem label="Depot recours" value={formatDate(tendering?.appealDepositDate)} />
                        <InfoItem label="Resultat recours" value={tendering?.appealResult ?? "-"} />
                        <InfoItem label="Programmation" value={formatDate(tendering?.programmingDate)} />
                        <InfoItem label="A.V.S." value={tendering?.avsStatus ? tendering.avsStatus.replace("_", " ") : "-"} />
                    </SimpleGrid>
                </Section>

                <Section title="Lots associes" icon={<FiLayers />}>
                    <VStack align="stretch" gap={3}>
                        {specification.lots?.length ? specification.lots.map(lot => (
                            <Box key={lot.id} border="1px solid" borderColor="neutral.200" borderRadius="md" p={4}>
                                <Flex justify="space-between" gap={3} align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }}>
                                    <Box>
                                        <Text
                                            asChild
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="neutral.900"
                                            _hover={{ color: "primary.600" }}
                                        >
                                            <RouterLink to={`/lots/${lot.id}`}>{lot.name}</RouterLink>
                                        </Text>
                                        <Text fontSize="xs" color="neutral.500">{lot.products?.length ?? 0} products</Text>
                                    </Box>
                                    <HStack color="primary.700" fontSize="sm">
                                        <FiGrid />
                                        <Text>{lot.designation?.name ?? specification.designation?.name}</Text>
                                    </HStack>
                                </Flex>
                            </Box>
                        )) : (
                            <Text fontSize="sm" color="neutral.500">Aucun lot associe.</Text>
                        )}
                    </VStack>
                </Section>
            </SimpleGrid>
            </>
            )}
        </Box>
    )
}

export default SpecificationDetailPage
