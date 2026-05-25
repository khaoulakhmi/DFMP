// src/shared/components/atoms/badge.tsx
import { defineRecipe } from "@chakra-ui/react"

export const badgeRecipe = defineRecipe({
    base: {
        display:        "inline-flex",
        alignItems:     "center",
        gap:            "1.5",
        px:             "2",
        py:             "0.5",
        borderRadius:   "full",
        fontSize:       "xs",
        fontWeight:     "medium",
        whiteSpace:     "nowrap",
    },

    variants: {
        variant: {
            success: {
                bg:    "success.50",
                color: "success.600",
            },
            error: {
                bg:    "error.50",
                color: "error.600",
            },
            warning: {
                bg:    "warning.50",
                color: "warning.600",
            },
            primary: {
                bg:    "primary.100",
                color: "primary.700",
            },
            secondary: {
                bg:    "secondary.100",
                color: "secondary.700",
            },
            neutral: {
                bg:    "neutral.100",
                color: "neutral.600",
            },
            accent: {
                bg:    "accent.100",
                color: "accent.700",
            },
        }
    },

    defaultVariants: {
        variant: "neutral"
    }
})