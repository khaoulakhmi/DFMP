import { Box, Text } from "@chakra-ui/react"

interface TableEmptyProps {
    search: string
}

const TableEmpty = ({ search }: TableEmptyProps) => {
    return (
        <Box py={16} textAlign="center">
            <Text fontSize="2xl" mb={2}>🗂️</Text>
            <Text fontSize="sm" fontWeight="medium" color="neutral.600">
                {search ? "No results found" : "No data available"}
            </Text>
            {search && (
                <Text fontSize="xs" color="neutral.400" mt={1}>
                    Try adjusting your search
                </Text>
            )}
        </Box>
    )
}

export default TableEmpty