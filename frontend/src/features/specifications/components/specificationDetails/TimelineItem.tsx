import { formatDate } from "../specification.utils"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { FiCalendar, FiCheckCircle } from "react-icons/fi"

type TimelineItemProps = {
    label: string
    value?: string | null | undefined
    done: boolean
}

const TimelineItem = ({ label, value, done }: TimelineItemProps) => (
    <HStack align="flex-start" gap={3}>
        <Flex
            w="8"
            h="8"
            align="center"
            justify="center"
            bg={done ? "success.50" : "neutral.100"}
            color={done ? "success.700" : "neutral.500"}
            borderRadius="full"
            flexShrink={0}
        >
            {done ? <FiCheckCircle /> : <FiCalendar />}
        </Flex>
        <Box>
            <Text fontSize="sm" fontWeight="semibold" color="neutral.800">{label}</Text>
            <Text fontSize="xs" color="neutral.500">{formatDate(value)}</Text>
        </Box>
    </HStack>
)

export default TimelineItem
