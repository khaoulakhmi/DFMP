import { defineRecipe } from "@chakra-ui/react"

export const selectRecipe = defineRecipe({
  base: {
    borderRadius: "md",
    borderWidth: "1px",
    borderColor: "neutral.300",
    bg: "bg.card",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "scale(1)",
    boxShadow: "sm",
    color: "neutral.900",
    
    _placeholder: {
      color: "neutral.500",
    },
    
    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      bg: "neutral.100",
      borderColor: "neutral.200",
    },
    
    _readOnly: {
      bg: "neutral.50",
      cursor: "default",
    },
    
    _focusWithin: {
      outline: "none",
      borderColor: "primary.500",
      boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
      transform: "scale(1.01)",
    },
  },

  variants: {
    variant: {
      outline: {
        bg: "transparent",
        
        _hover: {
          borderColor: "primary.400",
          bg: "neutral.50",
        },
      },

      filled: {
        bg: "neutral.100",
        borderColor: "transparent",
        
        _hover: {
          bg: "neutral.200",
          borderColor: "neutral.300",
        },
        
        _focusWithin: {
          bg: "white",
          borderColor: "primary.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
        },
      },

      flushed: {
        borderRadius: "0",
        borderWidth: "0",
        borderBottomWidth: "2px",
        borderBottomColor: "neutral.300",
        bg: "transparent",
        px: "0",
        
        _hover: {
          borderBottomColor: "neutral.400",
        },
        
        _focusWithin: {
          borderBottomColor: "primary.500",
          boxShadow: "0 2px 0 0 var(--chakra-colors-primary-500)",
          transform: "scale(1)",
        },
      },
      
      subtle: {
        borderColor: "transparent",
        bg: "neutral.100",
        
        _hover: {
          bg: "neutral.200",
        },
        
        _focusWithin: {
          bg: "white",
          borderColor: "primary.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-primary-200)",
        },
      },
    },

    size: {
      xs: { 
        px: "2.5", 
        py: "1", 
        fontSize: "xs",
        minH: "8",
      },
      sm: { 
        px: "3", 
        py: "1.5", 
        fontSize: "sm",
        minH: "9",
      },
      md: { 
        px: "4", 
        py: "2", 
        fontSize: "md",
        minH: "10",
      },
      lg: { 
        px: "5", 
        py: "3", 
        fontSize: "lg",
        minH: "11",
      },
      xl: { 
        px: "6", 
        py: "4", 
        fontSize: "xl",
        minH: "12",
      },
    },

    state: {
      valid: {
        borderColor: "success.500",
        
        _focusWithin: {
          borderColor: "success.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-success-200)",
        },
      },
      
      invalid: {
        borderColor: "error.500",
        
        _focusWithin: {
          borderColor: "error.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-error-200)",
        },
      },
      
      warning: {
        borderColor: "warning.500",
        
        _focusWithin: {
          borderColor: "warning.500",
          boxShadow: "0 0 0 3px var(--chakra-colors-warning-200)",
        },
      },
    },
  },

  compoundVariants: [
    // Filled variant with states
    {
      variant: "filled",
      state: "valid",
      css: {
        bg: "success.50",
        
        _focusWithin: {
          bg: "white",
        },
      },
    },
    {
      variant: "filled",
      state: "invalid",
      css: {
        bg: "error.50",
        
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
        
        _focusWithin: {
          bg: "white",
        },
      },
    },
    
    // Subtle variant with states
    {
      variant: "subtle",
      state: "valid",
      css: {
        bg: "success.50",
        
        _focusWithin: {
          bg: "white",
          borderColor: "success.500",
        },
      },
    },
    {
      variant: "subtle",
      state: "invalid",
      css: {
        bg: "error.50",
        
        _focusWithin: {
          bg: "white",
          borderColor: "error.500",
        },
      },
    },
  ],

  defaultVariants: {
    variant: "outline",
    size: "md",
  },
})