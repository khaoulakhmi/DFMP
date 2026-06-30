import type { StepperItem } from "@/shared/components/molecules/stepper"
import type { Designation } from "@/shared/types/designation.types"
import type { Lot } from "@/shared/types/lot.types"
import { VStack } from "@chakra-ui/react"
import type { FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form"
import { FiCalendar, FiCheckCircle, FiFileText, FiGlobe } from "react-icons/fi"
import DepositVisaFields from "../specificationForm/DepositVisaFields"
import EvaluationFields from "../specificationForm/EvaluationFields"
import GeneralInformationFields from "../specificationForm/GeneralInformationFields"
import LotCheckboxGrid from "../specificationForm/LotCheckboxGrid"
import PublicityFields from "../specificationForm/PublicityFields"
import type { SpecificationForm } from "../specificationForm/types"
import CreateSpecificationSection from "./CreateSpecificationSection"

type BuildCreateSpecificationStepsParams = {
    availableLots: Lot[]
    designations: Designation[]
    errors: FieldErrors<SpecificationForm>
    getValues: UseFormGetValues<SpecificationForm>
    register: UseFormRegister<SpecificationForm>
}

export const buildCreateSpecificationSteps = ({
    availableLots,
    designations,
    errors,
    getValues,
    register,
}: BuildCreateSpecificationStepsParams): StepperItem[] => [
    {
        title: "General",
        description: "Procedure and amounts",
        icon: <FiFileText />,
        content: (
            <CreateSpecificationSection title="Informations generales" description="Type de procedure, designation concernee et enveloppe financiere.">
                <GeneralInformationFields designations={designations} errors={errors} getValues={getValues} register={register} />
            </CreateSpecificationSection>
        ),
    },
    {
        title: "Depot & visa",
        description: "C.M. and visa dates",
        icon: <FiCalendar />,
        content: (
            <CreateSpecificationSection title="Depot et visa" description="Suivi interne du depot C.M., seance et visa.">
                <DepositVisaFields register={register} />
            </CreateSpecificationSection>
        ),
    },
    {
        title: "Publicite",
        description: "Journals and linked lots",
        icon: <FiGlobe />,
        content: (
            <VStack gap={8} align="stretch">
                <CreateSpecificationSection title="Publicite" description="Journaux papier et electroniques en arabe et francais.">
                    <PublicityFields register={register} />
                </CreateSpecificationSection>
                <CreateSpecificationSection title="Lots concernes" description="Lots lies au meme designation que le cahier de charge.">
                    <LotCheckboxGrid lots={availableLots} register={register} />
                </CreateSpecificationSection>
            </VStack>
        ),
    },
    {
        title: "Evaluation",
        description: "Attribution and appeals",
        icon: <FiCheckCircle />,
        content: (
            <CreateSpecificationSection title="Evaluation et attribution" description="Dates d'ouverture, evaluation technique/financiere, attribution, recours et A.V.S.">
                <EvaluationFields register={register} />
            </CreateSpecificationSection>
        ),
    },
]
