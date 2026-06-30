import SelectField from "@/shared/components/molecules/Forms/selectField"
import TextField from "@/shared/components/molecules/Forms/textField"
import { useI18n } from "@/shared/i18n/useI18n"
import type { Designation } from "@/shared/types/designation.types"
import { SimpleGrid } from "@chakra-ui/react"
import type { FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form"
import type { SpecificationForm } from "./types"

type GeneralInformationFieldsProps = {
    designations: Designation[]
    errors: FieldErrors<SpecificationForm>
    getValues: UseFormGetValues<SpecificationForm>
    register: UseFormRegister<SpecificationForm>
}

const specificationTypeValues = ["AO", "AP", "AC", "BC", "MG"] as const

const GeneralInformationFields = ({ designations, errors, getValues, register }: GeneralInformationFieldsProps) => {
    const { t } = useI18n()

    const required = (field: string) => t("validation.required", { field })

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <SelectField
                label={t("specification.general.type")}
                error={errors.type?.message}
                required
                showRequiredIndicator
                {...register("type", {
                    required: required(t("specification.general.type")),
                    validate: value => specificationTypeValues.includes(value as typeof specificationTypeValues[number]) || t("validation.invalidType"),
                })}
            >
                <option value="">{t("specification.type.placeholder")}</option>
                {specificationTypeValues.map(type => (
                    <option key={type} value={type}>{t(`specification.type.${type}`)}</option>
                ))}
            </SelectField>
            <SelectField
                label={t("specification.general.designation")}
                error={errors.designationId?.message}
                required
                showRequiredIndicator
                {...register("designationId", {
                    required: required(t("specification.general.designation")),
                    validate: value => Number(value) > 0 || t("validation.invalidDesignation"),
                })}
            >
                <option value="">{t("specification.designation.placeholder")}</option>
                {designations.map(designation => (
                    <option key={designation.id} value={designation.id}>{designation.name}</option>
                ))}
            </SelectField>
            <TextField
                label={t("specification.general.minAmount")}
                type="number"
                inputMode="decimal"
                error={errors.minAmount?.message}
                required
                showRequiredIndicator
                {...register("minAmount", {
                    required: required(t("specification.general.minAmount")),
                    valueAsNumber: true,
                    min: { value: 0, message: t("validation.positiveMinAmount") },
                })}
            />
            <TextField
                label={t("specification.general.maxAmount")}
                type="number"
                inputMode="decimal"
                error={errors.maxAmount?.message}
                required
                showRequiredIndicator
                {...register("maxAmount", {
                    required: required(t("specification.general.maxAmount")),
                    valueAsNumber: true,
                    min: { value: 0, message: t("validation.positiveMaxAmount") },
                    validate: value => value >= Number(getValues("minAmount") || 0) || t("validation.maxGreaterThanMin"),
                })}
            />
            <TextField
                label={t("specification.general.year")}
                type="number"
                error={errors.year?.message}
                required
                showRequiredIndicator
                {...register("year", {
                    required: required(t("specification.general.year")),
                    valueAsNumber: true,
                    min: { value: 2000, message: t("validation.yearTooOld") },
                })}
            />
        </SimpleGrid>
    )
}

export default GeneralInformationFields
