import {
  chakra,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react"
import { selectRecipe } from "../../theme/recipes/select.recipe"
import { FaChevronDown } from "react-icons/fa";
import type { ReactNode } from "react"

const SelectRoot = chakra("div", selectRecipe)

const SelectField = chakra("select", {
  base: {
    flex: 1,
    appearance: "none",
    bg: "transparent",
    border: "none",
    outline: "none",
    cursor: "pointer",
    _focus: { outline: "none" },
  },
})

type SelectVariants = RecipeVariantProps<typeof selectRecipe>

interface SelectProps
  extends HTMLChakraProps<"select">,
    SelectVariants {
  leftIcon?: ReactNode
}

const Select = ({ leftIcon, children, ...props }: SelectProps) => {
  const { variant, size, ...fieldProps } = props

  return (
    <SelectRoot
      role="group"
      display="flex"
      alignItems="center"
      gap="2"
      width={props.width || "100%"}
      color="text.secondary"
      _focusWithin={{ color: "accent.500" }}
      variant={variant}
      size={size}
    >
      {leftIcon && (
        <chakra.span display="flex" alignItems="center" color="inherit">
          {leftIcon}
        </chakra.span>
      )}

      <SelectField {...fieldProps}>{children}</SelectField>

      <chakra.span
        display="flex"
        alignItems="center"
        color="inherit"
        pointerEvents="none"
      >
        <FaChevronDown size={18} />
      </chakra.span>
    </SelectRoot>
  )
}

export default Select