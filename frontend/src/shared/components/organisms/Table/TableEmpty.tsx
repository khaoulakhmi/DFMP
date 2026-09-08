import { Box, Text } from "@chakra-ui/react"
import { useI18n } from "@/shared/i18n/useI18n"

interface TableEmptyProps {
    search: string
}

const TableEmpty = ({ search }: TableEmptyProps) => {
    const { t } = useI18n()
    return (
        <Box py={16} textAlign="center">
            <Text fontSize="2xl" mb={2}>🗂️</Text>
            <Text fontSize="sm" fontWeight="medium" color="neutral.600">
                {search ? t("common.noResults") : t("common.noData")}
            </Text>
            {search && (
                <Text fontSize="xs" color="neutral.400" mt={1}>
                    {t("common.tryAdjustingSearch")}
                </Text>
            )}
        </Box>
    )
}

export default TableEmpty
