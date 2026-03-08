import {
  chakra,
  type HTMLChakraProps,
  type RecipeVariantProps,
  
} from "@chakra-ui/react"
import { inputRecipe } from "../../theme/recipes/input.recipe"
import type { ReactNode } from "react"

const InputRoot = chakra("div", inputRecipe)

const InputField = chakra("input", {
  base: {
    flex: 1,
    bg: "transparent",
    border: "none",
    outline: "none",
    _focus: { outline: "none" },
    _placeholder: { color: "text.secondary" },
  },
})

type InputVariants = RecipeVariantProps<typeof inputRecipe>

interface InputProps
  extends HTMLChakraProps<"input">, InputVariants {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Input = ({ leftIcon, rightIcon, ...props }: InputProps) => {
  return (
    <InputRoot
      role="group"
      display="flex"
      alignItems="center"
      gap="2"
      px="3"
      width= {props.width || "100%"}
      color="text.secondary"
      _focusWithin={{ color: "primary.500" }}
      {...props}
    >
      {leftIcon && (
        <chakra.span display="flex" alignItems="center" color="inherit">
          {leftIcon}
        </chakra.span>
      )}

      <InputField {...props} />

      {rightIcon && (
        <chakra.span display="flex" alignItems="center" color="inherit">
          {rightIcon}
        </chakra.span>
      )}
    </InputRoot>
  )
}

export default Input