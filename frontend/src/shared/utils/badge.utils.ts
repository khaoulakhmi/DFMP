// src/shared/utils/badge.utils.ts
import type { BadgeVariant } from "@/shared/components/atoms/badge"

export const getStatusBadgeProps = (status: boolean) => ({
    label:   status ? "Active" : "Inactive",
    variant: "neutral" as BadgeVariant,
    dot:     true,
    dotColor: status ? "success.500" : "error.500" // 👈 dynamic dot color
})

export const getRoleBadgeProps = (role: string) => {
    const map: Record<string, { variant: BadgeVariant; icon: string }> = {
        ADMIN:      { variant: "primary",   icon: "👑" },
        SALES:      { variant: "accent",    icon: "💼" },
        FINANCE:    { variant: "success",   icon: "💰" },
        ACCOUNTANT: { variant: "warning",   icon: "📊" },
    }
    const config = map[role] ?? { variant: "neutral", icon: "👤" }
    return {
        label:   role,
        variant: config.variant,
        icon:    config.icon,
    }
}