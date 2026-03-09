import { defineRecipe } from "@chakra-ui/react"

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: "sm",
    borderWidth: "1px",
    borderColor: "neutral.300",
    bg: "white",
    transform: "scale(1)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "sm",
    color: "neutral.900",
    width: "100%",
    
    _placeholder: {
      color: "neutral.500",
      opacity: 0.8,
    },

    _hover: {
      borderColor: "primary.400",
      bg: "neutral.50",
    },

    _focus: {
      outline: "none",
      borderColor: "primary.500",
      boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
      transform: "scale(1.01)",
      bg: "white",
    },

    _focusWithin: {
      outline: "none",
      borderColor: "primary.500",
      boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
      transform: "scale(1.01)",
      bg: "white",
    },

    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      bg: "neutral.100",
      borderColor: "neutral.200",
      _hover: {
        borderColor: "neutral.200",
        bg: "neutral.100",
      },
    },

    _readOnly: {
      bg: "neutral.50",
      cursor: "default",
      borderColor: "neutral.200",
      
      _hover: {
        borderColor: "neutral.200",
        bg: "neutral.50",
      },
    },
  },

  variants: {
    variant: {
      outline: {
        bg: "white",
        
        _hover: {
          borderColor: "primary.400",
          bg: "neutral.50",
        },
        
        _focus: {
          bg: "white",
        },
        
        _focusWithin: {
          bg: "white",
        },
      },

      filled: {
        bg: "neutral.100",
        borderColor: "transparent",
        
        _hover: {
          bg: "neutral.200",
          borderColor: "neutral.300",
        },
        
        _focus: {
          bg: "white",
          borderColor: "primary.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
        },
        
        _focusWithin: {
          bg: "white",
          borderColor: "primary.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
        },
        
        _disabled: {
          bg: "neutral.100",
          borderColor: "transparent",
        },
      },

      flushed: {
        borderRadius: "0",
        borderWidth: "0",
        borderBottomWidth: "2px",
        borderBottomColor: "neutral.300",
        bg: "transparent",
        px: "0",
        boxShadow: "none",
        
        _hover: {
          borderBottomColor: "neutral.400",
          bg: "transparent",
        },
        
        _focus: {
          borderBottomColor: "primary.500",
          boxShadow: "0 2px 0 0 var(--chakra-colors-primary-500)",
          transform: "scale(1)",
          bg: "transparent",
        },
        
        _focusWithin: {
          borderBottomColor: "primary.500",
          boxShadow: "0 2px 0 0 var(--chakra-colors-primary-500)",
          transform: "scale(1)",
          bg: "transparent",
        },
        
        _placeholder: {
          color: "neutral.500",
        },
      },
      
      subtle: {
        bg: "transparent",
        borderColor: "transparent",
        boxShadow: "none",
        
        _hover: {
          bg: "neutral.100",
          borderColor: "neutral.200",
        },
        
        _focus: {
          bg: "white",
          borderColor: "primary.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
        },
        
        _focusWithin: {
          bg: "white",
          borderColor: "primary.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
        },
      },
      
      ghost: {
        borderColor: "transparent",
        bg: "transparent",
        boxShadow: "none",
        
        _hover: {
          bg: "neutral.100",
        },
        
        _focus: {
          borderColor: "primary.500",
          bg: "white",
          boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
        },
        
        _focusWithin: {
          borderColor: "primary.500",
          bg: "white",
          boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
        },
      },
    },

    state: {
      default: {},

      error: {
        borderColor: "error.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-error-500)",
        
        _hover: {
          borderColor: "error.600",
          bg: "error.50",
        },
        
        _focus: {
          borderColor: "error.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-error-200)",
          bg: "white",
        },
        
        _focusWithin: {
          borderColor: "error.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-error-200)",
          bg: "white",
        },
        
        _placeholder: {
          color: "error.400",
        },
      },

      success: {
        borderColor: "success.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-success-500)",
        
        _hover: {
          borderColor: "success.600",
          bg: "success.50",
        },
        
        _focus: {
          borderColor: "success.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-success-200)",
          bg: "white",
        },
        
        _focusWithin: {
          borderColor: "success.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-success-200)",
          bg: "white",
        },
        
        _placeholder: {
          color: "success.400",
        },
      },
      
      warning: {
        borderColor: "warning.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-warning-500)",
        
        _hover: {
          borderColor: "warning.600",
          bg: "warning.50",
        },
        
        _focus: {
          borderColor: "warning.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-warning-200)",
          bg: "white",
        },
        
        _focusWithin: {
          borderColor: "warning.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-warning-200)",
          bg: "white",
        },
        
        _placeholder: {
          color: "warning.400",
        },
      },
    },

    size: {
      xs: {
        px: "2.5",
        py: "1",
        fontSize: "xs",
        minH: "8",
        // borderRadius: "md",
      },
      sm: {
        px: "3",
        py: "1.5",
        fontSize: "sm",
        minH: "9",
        // borderRadius: "md",
      },
      md: {
        px: "4",
        py: "2",
        fontSize: "md",
        minH: "10",
        // borderRadius: "md",
      },
      lg: {
        px: "5",
        py: "3",
        fontSize: "lg",
        minH: "11",
        // borderRadius: "md",
      },
      xl: {
        px: "6",
        py: "4",
        fontSize: "xl",
        minH: "12",
        // borderRadius: "md",
      },
    },
  },

  compoundVariants: [
    // Filled variant with states
    {
      variant: "filled",
      state: "error",
      css: {
        bg: "error.50",
        
        _hover: {
          bg: "error.100",
        },
        
        _focus: {
          bg: "white",
        },
        
        _focusWithin: {
          bg: "white",
        },
      },
    },
    {
      variant: "filled",
      state: "success",
      css: {
        bg: "success.50",
        
        _hover: {
          bg: "success.100",
        },
        
        _focus: {
          bg: "white",
        },
        
        _focusWithin: {
          bg: "white",
        },
      },
    },
    {
      variant: "filled",
      state: "warning",
      css: {
        bg: "warning.50",
        
        _hover: {
          bg: "warning.100",
        },
        
        _focus: {
          bg: "white",
        },
        
        _focusWithin: {
          bg: "white",
        },
      },
    },
    
    // Subtle variant with states
    {
      variant: "subtle",
      state: "error",
      css: {
        bg: "error.50",
        
        _focus: {
          bg: "white",
        },
        
        _focusWithin: {
          bg: "white",
        },
      },
    },
    {
      variant: "subtle",
      state: "success",
      css: {
        bg: "success.50",
        
        _focus: {
          bg: "white",
        },
        
        _focusWithin: {
          bg: "white",
        },
      },
    },
    
    // Flushed variant with states
    {
      variant: "flushed",
      state: "error",
      css: {
        borderBottomColor: "error.500",
        
        _focus: {
          borderBottomColor: "error.500",
          boxShadow: "0 2px 0 0 var(--chakra-colors-error-500)",
        },
        
        _focusWithin: {
          borderBottomColor: "error.500",
          boxShadow: "0 2px 0 0 var(--chakra-colors-error-500)",
        },
      },
    },
    {
      variant: "flushed",
      state: "success",
      css: {
        borderBottomColor: "success.500",
        
        _focus: {
          borderBottomColor: "success.500",
          boxShadow: "0 2px 0 0 var(--chakra-colors-success-500)",
        },
        
        _focusWithin: {
          borderBottomColor: "success.500",
          boxShadow: "0 2px 0 0 var(--chakra-colors-success-500)",
        },
      },
    },
  ],

  defaultVariants: {
    variant: "outline",
    size: "md",
    state: "default",
  },
})