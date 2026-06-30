import Button from "@/shared/components/atoms/button"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import type { FieldErrors, UseFormGetValues, UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import { FiCalendar, FiCheckCircle, FiFileText, FiLayers, FiSave, FiX } from "react-icons/fi"
import DepositVisaFields from "../specificationForm/DepositVisaFields"
import EvaluationFields from "../specificationForm/EvaluationFields"
import GeneralInformationFields from "../specificationForm/GeneralInformationFields"
import LotCheckboxGrid from "../specificationForm/LotCheckboxGrid"
import PublicityFields from "../specificationForm/PublicityFields"
import type { SpecificationForm } from "../specificationForm/types"
import DetailSection from "./DetailSection"

type SpecificationEditFormProps = {
    availableLots: Lot[]
    designations: Designation[]
    errors: FieldErrors<SpecificationForm>
    getValues: UseFormGetValues<SpecificationForm>
    handleSubmit: UseFormHandleSubmit<SpecificationForm>
    isPending: boolean
    onCancel: () => void
    onSubmit: (data: SpecificationForm) => void
    register: UseFormRegister<SpecificationForm>
}

const SpecificationEditForm = ({
    availableLots,
    designations,
    errors,
    getValues,
    handleSubmit,
    isPending,
    onCancel,
    onSubmit,
    register,
}: SpecificationEditFormProps) => (
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
            <DetailSection title="Informations generales" icon={<FiFileText />}>
                <GeneralInformationFields designations={designations} errors={errors} getValues={getValues} register={register} />
            </DetailSection>

            <DetailSection title="Depot et visa" icon={<FiCalendar />}>
                <DepositVisaFields register={register} />
            </DetailSection>

            <DetailSection title="Publicite" icon={<FiFileText />}>
                <PublicityFields register={register} />
            </DetailSection>

            <DetailSection title="Lots associes" icon={<FiLayers />}>
                <LotCheckboxGrid lots={availableLots} register={register} />
            </DetailSection>

            <DetailSection title="Evaluation, attribution et recours" icon={<FiCheckCircle />}>
                <EvaluationFields register={register} />
            </DetailSection>
        </VStack>

        <Flex justify="flex-end" gap={3} px={{ base: 5, md: 8 }} py={5} bg="neutral.50" borderTop="1px solid" borderColor="neutral.200" wrap="wrap">
            <Box w={{ base: "full", sm: "32" }}>
                <Button type="button" variant="secondary" disabled={isPending} onClick={onCancel}>
                    <HStack justify="center"><FiX /><Text>Cancel</Text></HStack>
                </Button>
            </Box>
            <Box w={{ base: "full", sm: "44" }}>
                <Button type="submit" disabled={isPending}>
                    <HStack justify="center"><FiSave /><Text>{isPending ? "Saving..." : "Save changes"}</Text></HStack>
                </Button>
            </Box>
        </Flex>
    </Box>
)

export default SpecificationEditForm
