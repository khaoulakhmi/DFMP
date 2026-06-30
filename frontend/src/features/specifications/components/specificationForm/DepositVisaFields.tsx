import TextField from "@/shared/components/molecules/Forms/textField"
import { SimpleGrid } from "@chakra-ui/react"
import type { UseFormRegister } from "react-hook-form"
import type { SpecificationForm } from "./types"

type DepositVisaFieldsProps = {
    register: UseFormRegister<SpecificationForm>
}

const DepositVisaFields = ({ register }: DepositVisaFieldsProps) => (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <TextField label="Date depot C.M." type="date" {...register("depositDateCM")} />
        <TextField label="Date seance" type="date" {...register("sessionDate")} />
        <TextField label="Date visa" type="date" {...register("visaDate")} />
        <TextField label="No Visa" placeholder="VIS-2026-001" {...register("visaNumber")} />
    </SimpleGrid>
)

export default DepositVisaFields
