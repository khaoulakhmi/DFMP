import { Checkbox as ChakraCheckbox } from "@chakra-ui/react"
import Typography from "@/shared/components/atoms/typography";
interface Props extends ChakraCheckbox.RootProps {
  label?: string
}

const Checkbox = ({ label, ...props }: Props) => {
  return (
    <ChakraCheckbox.Root {...props}>
      <ChakraCheckbox.HiddenInput />

      <ChakraCheckbox.Control
        bg="transparent"
        _checked={{
          bg: "primary.600",
          borderColor: "primary.600",
        }}
      >
        <ChakraCheckbox.Indicator />
      </ChakraCheckbox.Control>

      {label && (
        <ChakraCheckbox.Label>
          <Typography variant="body-sm" color="neutral.700">
            {label}
          </Typography>
        </ChakraCheckbox.Label>
      )}
    </ChakraCheckbox.Root>
  )
}

export default Checkbox