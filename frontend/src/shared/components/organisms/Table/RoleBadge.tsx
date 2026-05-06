// src/shared/components/organisms/Table/RoleBadge.tsx
import Badge from "@/shared/components/atoms/badge"
import { getRoleBadgeProps } from "@/shared/utils/badge.utils"

interface RoleBadgeProps {
    value: string
}

export const RoleBadge = ({ value }: RoleBadgeProps) => {
    const props = getRoleBadgeProps(value)
    return <Badge {...props} />
}