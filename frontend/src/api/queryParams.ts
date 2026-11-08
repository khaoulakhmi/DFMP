type QueryValue = string | number | boolean | null | undefined

// Drops empty values so the strict backend schemas never receive
// `search=` or `designationId=undefined`.
export const toQueryParams = <T extends object>(params: T): Record<string, string | number | boolean> => {
    const result: Record<string, string | number | boolean> = {}

    for (const [key, value] of Object.entries(params) as Array<[string, QueryValue]>) {
        if (value === undefined || value === null) continue
        if (typeof value === "string" && value.trim() === "") continue
        result[key] = typeof value === "string" ? value.trim() : value
    }

    return result
}
