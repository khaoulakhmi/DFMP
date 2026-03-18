import type { ComponentProps } from "react"
import FormField from "@/shared/components/molecules/Forms/formfield"
import Radio from "@/shared/components/atoms/radio"

type RadioFieldProps = ComponentProps<typeof Radio> & {
  label?: string
  helper?: string
  error?: string | undefined
  required?: boolean
  showRequiredIndicator?: boolean
}

const RadioField = ({
  label = "",
  helper = "",
  error = "",
  required = false,
  showRequiredIndicator = false,
  ...radioProps
}: RadioFieldProps) => {
  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={required}
      showRequiredIndicator={showRequiredIndicator}
    >
      <Radio {...radioProps} />
    </FormField>
  )
}

export default RadioField