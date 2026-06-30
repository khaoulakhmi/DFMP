import TextField from "@/shared/components/molecules/Forms/textField"
import { SimpleGrid } from "@chakra-ui/react"
import type { UseFormRegister } from "react-hook-form"
import type { SpecificationForm } from "./types"

type PublicityFieldsProps = {
    register: UseFormRegister<SpecificationForm>
}

const PublicityFields = ({ register }: PublicityFieldsProps) => (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <TextField label="Date publication arabe" type="date" {...register("pubArabicDate")} />
        <TextField label="Journal arabe" placeholder="Nom du journal" {...register("pubArabicJournal")} />
        <TextField label="Date publication francaise" type="date" {...register("pubFrenchDate")} />
        <TextField label="Journal francais" placeholder="Nom du journal" {...register("pubFrenchJournal")} />
        <TextField label="Journal electronique arabe" placeholder="Plateforme / journal" {...register("pubArElecJournal")} />
        <TextField label="Journal electronique francais" placeholder="Plateforme / journal" {...register("pubFrElecJournal")} />
    </SimpleGrid>
)

export default PublicityFields
