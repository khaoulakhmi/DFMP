import type { Lot } from "@/shared/types/lot.types"
import type { TVA } from "@/shared/types/product.types"

export type SpecificationDetails = NonNullable<Lot["specifications"]> & {
    tendering?: NonNullable<Lot["specifications"]>["tendering"]
}

export const tvaLabels: Record<TVA, string> = {
    ZERO: "TVA 0%",
    NINE: "TVA 9%",
    NINETEEN: "TVA 19%",
}

export const tvaRate = (tva: TVA) =>
    tva === "NINETEEN" ? 0.19 : tva === "NINE" ? 0.09 : 0

export const formatDate = (value?: string | null) => {
    if (!value) return "Non renseignee"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date)
}

export const formatShortDate = (value?: string | null) => {
    if (!value) return "-"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
    }).format(date)
}

export const formatMoney = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) return "-"
    return `${new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
    }).format(value)} DA`
}
