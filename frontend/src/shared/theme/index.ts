import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { buttonRecipe } from "@/shared/theme/recipes/button.recipe";
import { inputRecipe } from "@/shared/theme/recipes/input.recipe";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { checkboxRecipe } from "@/shared/theme/recipes/checkbox.recipe";
import { typographyRecipe } from "./recipes/typography.recipe";
import { badgeRecipe } from "./recipes/badge.recipe";


const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                ...colors,
            },

            // Typography tokens
            ...typography,
            ...spacing,
            radii: {
                sm: { value: "4px" },
                md: { value: "8px" },
                lg: { value: "12px" },
                xl: { value: "16px" },
                full: { value: "9999px" },
            },
            
            shadows: {
                sm: { value: "0 1px 2px rgba(0,0,0,0.05)" },
                md: { value: "0 4px 6px rgba(0,0,0,0.08)" },
                lg: { value: "0 10px 15px rgba(0,0,0,0.1)" },
            },
        },
        keyframes: {
            shake: {
            "0%, 100%": { transform: "translateX(0)" },
            "25%": { transform: "translateX(-4px)" },
            "75%": { transform: "translateX(4px)" },
            },
        },
    
    // Semantic tokens allow us to define tokens that can adapt based on the color mode (light/dark) or other conditions. This is useful for defining colors that should change based on the theme.
        semanticTokens: {
        colors: {
            "bg.page": {
            value: "{colors.neutral.50}",
            },
            "bg.card": {
            value: "#ffffff",
            },
            "bg.sidebar": {
            value: "{colors.primary.900}",
            },

            "text.primary": {
            value: "{colors.primary.900}",
            },
            "text.secondary": {
            value: "{colors.neutral.700}",
            },
            "text.inverse": {
            value: "#ffffff",
            },

            "border.default": {
            value: "{colors.neutral.200}",
            },

            "state.success": {
            value: "{colors.success.500}",
            },
            "state.warning": {
            value: "{colors.warning.500}",
            },
            "state.error": {
            value: "{colors.error.500}",
            },
            "state.accent": {
            value: "{colors.accent.500}",
            },
        },
        },
        recipes: {
            button: buttonRecipe,
            input: inputRecipe,
            typography: typographyRecipe,
            badge: badgeRecipe,
        },
        slotRecipes: {
            checkbox: checkboxRecipe,
        }
    },
  globalCss: {
    "html, body": {
      bg: "bg.page",
      color: "text.primary",
      fontFamily: "body",
      lineHeight: "normal",
    },

    "*": {
      borderColor: "border.default",
    },

    a: {
      color: "primary.500",
      textDecoration: "none",
    },

    "a:hover": {
      textDecoration: "underline",
    },
  },
  
})


export const system = createSystem(defaultConfig, config)