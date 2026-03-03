import { defineRecipe } from "@chakra-ui/react"

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: "md",
    borderWidth: "1px",
    bg: "bg.card",
    transition: "all 0.2s ease",
    _placeholder: {
      color: "text.secondary",
    },
    _focusVisible: {
      outline: "none",
      boxShadow: "0 0 0 2px var(--chakra-colors-primary-400)",
      borderColor: "primary.400",
    },
  },

  variants: {
    variant: {
      outline: {
        borderColor: "border.default",
      },

      filled: {
        bg: "neutral.100",
        borderColor: "transparent",
        _hover: {
          bg: "neutral.200",
        },
      },

      flushed: {
        borderRadius: "0",
        borderBottomWidth: "1px",
        borderColor: "border.default",
        bg: "transparent",
      },
    },

    state: {
      default: {},

      error: {
        borderColor: "error.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-error-500)",
      },

      success: {
        borderColor: "success.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-success-500)",
      },
    },

    size: {
      sm: {
        px: "3",
        py: "1.5",
        fontSize: "sm",
      },
      md: {
        px: "4",
        py: "2",
        fontSize: "md",
      },
      lg: {
        px: "5",
        py: "3",
        fontSize: "lg",
      },
    },
  },

  defaultVariants: {
    variant: "outline",
    size: "md",
    state: "default",
  },
})