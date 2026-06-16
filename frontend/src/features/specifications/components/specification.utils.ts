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

export const formatMoney = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) return "-"
    return `${new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
    }).format(value)} DA`
}

export const optionalString = (value?: string | null) => {
    const trimmed = value?.trim()
    return trimmed ? trimmed : null
}

export const optionalDate = (value?: string | null) => value || null
