import SelectField from "@/shared/components/molecules/Forms/selectField"
import TextField from "@/shared/components/molecules/Forms/textField"
import { AVSStatus } from "@/shared/types/specification.types"
import { SimpleGrid } from "@chakra-ui/react"
import type { UseFormRegister } from "react-hook-form"
import type { SpecificationForm } from "./types"

type EvaluationFieldsProps = {
    register: UseFormRegister<SpecificationForm>
}

const EvaluationFields = ({ register }: EvaluationFieldsProps) => (
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
)

export default EvaluationFields
