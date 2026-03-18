import type { ComponentProps } from "react"
import FormField from "@/shared/components/molecules/Forms/formfield"
import Checkbox from "@/shared/components/atoms/checkbox"

type CheckboxFieldProps = ComponentProps<typeof Checkbox> & {
  helper?: string
  error?: string | undefined
  showRequiredIndicator?: boolean
  required?: ConstrainBooleanParameters,


}

const CheckboxField = ({
  helper = "",
  error = "",
  showRequiredIndicator = false,
  required = false,

  ...checkboxProps
 }: CheckboxFieldProps) => {
  return (
    <FormField 
        required= {required} 
        helper={helper} 
        error={error} 
        showRequiredIndicator={showRequiredIndicator}>
      <Checkbox {...checkboxProps} />
    </FormField>
  )
}

export default CheckboxField