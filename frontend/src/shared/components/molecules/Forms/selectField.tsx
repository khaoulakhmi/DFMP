import type { ComponentProps } from "react"
import FormField from "@/shared/components/molecules/Forms/formfield"
import Select from "@/shared/components/atoms/select"

type SelectFieldProps = ComponentProps<typeof Select> & {
  label?: string
  helper?: string
  error?: string
  required?: boolean
  showRequiredIndicator?: boolean
}

const SelectField = ({
  label = "",
  helper = "",
  error = "",
  required = false,
  showRequiredIndicator = false,
  id,
  ...selectProps
}: SelectFieldProps) => {
  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={required}
      showRequiredIndicator={showRequiredIndicator}
      {...(id && { labelFor: id })}
    >
      <Select id={id} {...selectProps} />
    </FormField>
  )
}

export default SelectField