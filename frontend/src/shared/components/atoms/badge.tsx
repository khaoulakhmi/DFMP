import type React from "react"
import { Box, type BoxProps } from "@chakra-ui/react"

export type BadgeVariant =
    | "success"
    | "error"
    | "warning"
    | "primary"
    | "secondary"
    | "neutral"
    | "accent"

type BadgeSize = "sm" | "md"
type BadgeTone = "subtle" | "solid" | "outline"

interface BadgeProps extends Omit<BoxProps, "children"> {
    label: string
    variant?: BadgeVariant
    size?: BadgeSize
    tone?: BadgeTone
    dot?: boolean
    dotColor?: string
    icon?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, {
    subtleBg: string
    subtleColor: string
    solidBg: string
    solidColor: string
    border: string
    dot: string
}> = {
    success: {
        subtleBg: "success.50",
        subtleColor: "success.600",
        solidBg: "success.500",
        solidColor: "white",
        border: "success.200",
        dot: "success.500",
    },
    error: {
        subtleBg: "error.50",
        subtleColor: "error.600",
        solidBg: "error.500",
        solidColor: "white",
        border: "error.200",
        dot: "error.500",
    },
    warning: {
        subtleBg: "warning.50",
        subtleColor: "warning.700",
        solidBg: "warning.500",
        solidColor: "white",
        border: "warning.200",
        dot: "warning.500",
    },
    primary: {
        subtleBg: "primary.200",
        subtleColor: "primary.700",
        solidBg: "primary.600",
        solidColor: "white",
        border: "primary.300",
        dot: "primary.500",
    },
    secondary: {
        subtleBg: "secondary.100",
        subtleColor: "secondary.700",
        solidBg: "secondary.600",
        solidColor: "white",
        border: "secondary.300",
        dot: "secondary.500",
    },
    neutral: {
        subtleBg: "neutral.100",
        subtleColor: "neutral.700",
        solidBg: "neutral.700",
        solidColor: "white",
        border: "neutral.300",
        dot: "neutral.500",
    },
    accent: {
        subtleBg: "accent.100",
        subtleColor: "accent.700",
        solidBg: "accent.500",
        solidColor: "white",
        border: "accent.200",
        dot: "accent.500",
    },
}

const sizeStyles: Record<BadgeSize, {
    px: string
    py: string
    gap: string
    fontSize: string
    dotSize: string
    iconSize: string
    minH: string
}> = {
    sm: {
        px: "2",
        py: "0.5",
        gap: "1.5",
        fontSize: "xs",
        dotSize: "1.5",
        iconSize: "3",
        minH: "6",
    },
    md: {
        px: "2.5",
        py: "1",
        gap: "2",
        fontSize: "sm",
        dotSize: "2",
        iconSize: "3.5",
        minH: "7",
    },
}

const getToneStyles = (
    tone: BadgeTone,
    styles: (typeof variantStyles)[BadgeVariant],
) => {
    if (tone === "solid") {
        return {
            bg: styles.solidBg,
            borderColor: styles.solidBg,
            color: styles.solidColor,
        }
    }

    if (tone === "outline") {
        return {
            bg: "transparent",
            borderColor: styles.border,
            color: styles.subtleColor,
        }
    }

    return {
        bg: styles.subtleBg,
        borderColor: styles.border,
        color: styles.subtleColor,
    }
}

const Badge = ({
    label,
    variant = "neutral",
    size = "sm",
    tone = "subtle",
    dot = false,
    dotColor,
    icon,
    ...props
}: BadgeProps) => {
    const styles = variantStyles[variant]
    const sizes = sizeStyles[size]
    const toneStyles = getToneStyles(tone, styles)

    return (
        <Box
            display="inline-flex"
            alignItems="center"
            gap={sizes.gap}
            px={sizes.px}
            py={sizes.py}
            borderRadius="full"
            borderWidth="1px"
            boxShadow="0 1px 1px rgba(31, 47, 52, 0.04)"
            fontSize={sizes.fontSize}
            fontWeight="semibold"
            lineHeight="1"
            maxW="full"
            minH={sizes.minH}
            verticalAlign="middle"
            whiteSpace="nowrap"
            {...toneStyles}
            {...props}
        >
            {dot && (
                <Box
                    w={sizes.dotSize}
                    h={sizes.dotSize}
                    borderRadius="full"
                    bg={dotColor ?? styles.dot}
                    boxShadow="0 0 0 2px var(--chakra-colors-bg-card)"
                    flexShrink={0}
                />
            )}
            {icon && (
                <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={sizes.iconSize}
                    flexShrink={0}
                    lineHeight="1"
                >
                    {icon}
                </Box>
            )}
            <Box as="span" overflow="hidden" textOverflow="ellipsis">
                {label}
            </Box>
        </Box>
    )
}

export default Badge
