import SelectField from "@/shared/components/molecules/Forms/selectField"
import TextField from "@/shared/components/molecules/Forms/textField"
import { useI18n } from "@/shared/i18n/useI18n"
import DesignationSelect from "@/shared/components/molecules/Forms/DesignationSelect"
import type { Designation } from "@/shared/types/designation.types"
import { SimpleGrid } from "@chakra-ui/react"
import { Controller, type Control, type FieldErrors, type UseFormGetValues, type UseFormRegister } from "react-hook-form"
import type { SpecificationForm } from "./types"

type GeneralInformationFieldsProps = {
    control: Control<SpecificationForm>
    // Designation of the record being edited, so its label shows immediately.
    selectedDesignation?: Designation | null | undefined
    errors: FieldErrors<SpecificationForm>
    getValues: UseFormGetValues<SpecificationForm>
    register: UseFormRegister<SpecificationForm>
}

const specificationTypeValues = ["AO", "AP", "AC", "BC", "MG"] as const

const GeneralInformationFields = ({ control, selectedDesignation, errors, getValues, register }: GeneralInformationFieldsProps) => {
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
            <Controller
                control={control}
                name="designationId"
                rules={{
                    required: required(t("specification.general.designation")),
                    validate: value => Number(value) > 0 || t("validation.invalidDesignation"),
                }}
                render={({ field }) => (
                    <DesignationSelect
                        label={t("specification.general.designation")}
                        placeholder={t("specification.designation.placeholder")}
                        error={errors.designationId?.message}
                        required
                        showRequiredIndicator
                        selectedItem={selectedDesignation}
                        value={field.value}
                        onChange={designation => field.onChange(designation ? String(designation.id) : "")}
                        onBlur={field.onBlur}
                    />
                )}
            />
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
