import type { ComponentProps } from "react"
import FormField from "@/shared/components/molecules/Forms/formfield"
import Input from "@/shared/components/atoms/input"

type TextFieldProps = ComponentProps<typeof Input> & {
  label?: string
  helper?: string
  error?: string | undefined
  required?: boolean
  showRequiredIndicator?: boolean
}

const TextField = ({
  label = "",
  helper = "",
  error = "",
  required = false,
  showRequiredIndicator = false,
  id,
  ...inputProps
}: TextFieldProps) => {
  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={required}
      labelFor={id}
      showRequiredIndicator={showRequiredIndicator}
    >
      <Input id={id} {...inputProps} />
    </FormField>
  )
}

export default TextField