import { defineRecipe } from "@chakra-ui/react"

export const typographyRecipe = defineRecipe({
  base: {
    fontFamily: "body",
    color: "neutral.900",
  },

  variants: {
    variant: {
      body: {
        fontSize: "md",
        fontWeight: "normal",
        lineHeight: "normal",
      },

      "body-sm": {
        fontSize: "sm",
        fontWeight: "normal",
        lineHeight: "normal",
      },

      heading: {
        fontFamily: "heading",
        fontSize: "3xl",
        fontWeight: "bold",
        lineHeight: "tight",
      },

      "heading-sm": {
        fontFamily: "heading",
        fontSize: "xl",
        fontWeight: "semibold",
        lineHeight: "tight",
      },

      caption: {
        fontSize: "xs",
        color: "neutral.600",
      },

      label: {
        fontSize: "sm",
        fontWeight: "medium",
      },
    },
  },

  defaultVariants: {
    variant: "body",
  },
})