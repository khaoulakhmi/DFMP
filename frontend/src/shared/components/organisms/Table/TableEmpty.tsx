import { Box, Text } from "@chakra-ui/react"
import { useI18n } from "@/shared/i18n/useI18n"

interface TableEmptyProps {
    search: string
    // True when a search or filter is narrowing the results.
    filtered?: boolean
}

const TableEmpty = ({ search, filtered = Boolean(search) }: TableEmptyProps) => {
    const { t } = useI18n()
    return (
        <Box py={16} textAlign="center">
            <Text fontSize="2xl" mb={2}>🗂️</Text>
            <Text fontSize="sm" fontWeight="medium" color="neutral.600">
                {filtered ? t("common.noResults") : t("common.noData")}
            </Text>
            {filtered && (
                <Text fontSize="xs" color="neutral.400" mt={1}>
                    {t("common.tryAdjustingSearch")}
                </Text>
            )}
        </Box>
    )
}

export default TableEmpty
