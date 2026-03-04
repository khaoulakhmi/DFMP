import { defineRecipe } from "@chakra-ui/react"

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: "md",
    borderWidth: "1px",
    borderColor: "border.default",
    bg: "bg.card",
    transform: "scale(1)",
  transition: "all 0.18s ease",

    _placeholder: {
      color: "text.secondary",
    },

    _focusVisible: {
      outline: "none",
      borderColor: "primary.500",
       boxShadow: "0 0 0 2px var(--chakra-colors-primary-200)",
      transform: "scale(1.01)",
    },

    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },

  variants: {
    variant: {
      outline: {},

      filled: {
        bg: "neutral.100",
        borderColor: "transparent",

        _hover: {
          bg: "neutral.200",
        },

        _focusVisible: {
          bg: "bg.card",
        },
      },

      flushed: {
        borderRadius: "0",
        borderWidth: "0",
        borderBottomWidth: "2px",
        borderBottomColor: "border.default",
        bg: "transparent",

        _focusVisible: {
          borderBottomColor: "primary.500",
          boxShadow: "0 2px 0 0 var(--chakra-colors-primary-500)",
        },
      },
    },

    state: {
      default: {},

      error: {
        borderColor: "error.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-error-500)",
        animation: "shake 0.25s ease-in-out",

        _focusVisible: {
          borderColor: "error.500",
          boxShadow: "0 0 0 2px var(--chakra-colors-error-200)",
        },
      },

      success: {
        borderColor: "success.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-success-500)",

        _focusVisible: {
          borderColor: "success.500",
          boxShadow: "0 0 0 2px var(--chakra-colors-success-200)",
        },
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