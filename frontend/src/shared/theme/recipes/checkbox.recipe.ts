import { defineSlotRecipe } from "@chakra-ui/react"

export const checkboxRecipe = defineSlotRecipe({
  slots: ["root", "control", "label", "indicator"],

  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2",
    },

    control: {
      borderWidth: "1px",
      borderRadius: "sm",
      borderColor: "neutral.400",
      transition: "all 0.2s",

      "&[data-state=checked]": {
        bg: "primary.300",
        borderColor: "primary.600",
        color: "white",
      },
    },

    label: {
      fontSize: "sm",
      color: "neutral.800",
    },

    indicator: {
      color: "white",
    },
  },
})