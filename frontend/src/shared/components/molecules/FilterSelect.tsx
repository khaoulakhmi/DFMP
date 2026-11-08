import { useId } from "react"
import { chakra, HStack } from "@chakra-ui/react"

type FilterOption = { value: string; label: string }

interface FilterSelectProps {
    label: string
    value: string
    options: FilterOption[]
    onChange: (value: string) => void
}

// Compact select for table toolbars. An empty value means "no filter".
const FilterSelect = ({ label, value, options, onChange }: FilterSelectProps) => {
    const id = useId()

    return (
        <HStack gap={2}>
            <chakra.label htmlFor={id} fontSize="sm" color="neutral.500" whiteSpace="nowrap">
                {label}
            </chakra.label>
            <select
                id={id}
                value={value}
                onChange={event => onChange(event.target.value)}
                style={{
                    fontSize: "14px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid #e3eaee",
                    background: "white",
                    minWidth: "120px",
                }}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </HStack>
    )
}

export default FilterSelect
