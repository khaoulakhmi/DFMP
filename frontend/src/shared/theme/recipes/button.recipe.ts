import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "medium",
    borderRadius: "md",
    transition: "all 0.2s ease",
    cursor: "pointer",
    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },

  variants: {
    variant: {
      primary: {
        bg: "primary.500",
        color: "white",
        _hover: {
          bg: "primary.600",
        },
      },

      secondary: {
        bg: "neutral.100",
        color: "text.primary",
        _hover: {
          bg: "neutral.200",
        },
      },

      accent: {
        bg: "accent.500",
        color: "white",
        _hover: {
          bg: "accent.600",
        },
      },

      danger: {
        bg: "error.500",
        color: "white",
        _hover: {
          bg: "error.600",
        },
      },

      ghost: {
        bg: "transparent",
        color: "primary.600",
        _hover: {
          bg: "neutral.100",
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
        px: "6",
        py: "3",
        fontSize: "lg",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})