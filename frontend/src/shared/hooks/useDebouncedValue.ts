import { useEffect, useState } from "react"

// Returns `value` once it has stopped changing for `delayMs`.
export const useDebouncedValue = <T,>(value: T, delayMs = 300): T => {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delayMs)
        return () => window.clearTimeout(timer)
    }, [value, delayMs])

    return debounced
}
