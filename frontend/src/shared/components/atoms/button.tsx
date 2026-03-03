import {  useStyleConfig, Button as ChakraButton } from "@chakra-ui/react"

type AppButtonProps = React.ComponentProps<typeof ChakraButton> & {
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = ({ variant = "primary", size = "md", ...props }: AppButtonProps) => {
  // useStyleConfig maps the recipe into CSS
  const styles = useStyleConfig("button", { variant, size })

  return <ChakraButton style={styles} {...props} />
}