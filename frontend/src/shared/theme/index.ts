import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { buttonRecipe } from "./recipes/button.recipe";
import { inputRecipe } from "./recipes/input.recipe";


const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                ...colors,
            },

            // Typography tokens
            fonts: {
                heading: { value: "'Inter', sans-serif" },
                body: { value: "'Inter', sans-serif" },
            },
            fontSizes: {
                xs: { value: "12px" },
                sm: { value: "14px" },
                md: { value: "16px" },
                lg: { value: "18px" },
                xl: { value: "20px" },
                "2xl": { value: "24px" },
                "3xl": { value: "30px" },
                "4xl": { value: "36px" },
            },
            fontWeights: {
                normal: { value: "400" },
                medium: { value: "500" },
                semibold: { value: "600" },
                bold: { value: "700" },
            },
            lineHeights: {
                normal: { value: "1.5" },
                relaxed: { value: "1.625" },
                tight: { value: "1.25" },
            },

            radii: {
                sm: { value: "4px" },
                md: { value: "8px" },
                lg: { value: "12px" },
                xl: { value: "16px" },
                full: { value: "9999px" },
            },
            spacing: {
                1: { value: "4px" },
                2: { value: "8px" },
                3: { value: "12px" },
                4: { value: "16px" },
                5: { value: "20px" },
                6: { value: "24px" },
                8: { value: "32px" },
                10: { value: "40px" },
                12: { value: "48px" },
                16: { value: "64px" },
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