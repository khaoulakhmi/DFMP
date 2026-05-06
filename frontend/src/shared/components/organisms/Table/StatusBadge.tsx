// src/shared/components/organisms/Table/StatusBadge.tsx
import Badge from "@/shared/components/atoms/badge"
import { getStatusBadgeProps } from "@/shared/utils/badge.utils"

interface StatusBadgeProps {
    value: boolean
}

export const StatusBadge = ({ value }: StatusBadgeProps) => {
    const props = getStatusBadgeProps(value)
    return <Badge {...props} />
}