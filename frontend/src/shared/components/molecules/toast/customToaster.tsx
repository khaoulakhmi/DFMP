// CustomToast.tsx
import { Box, HStack, Text } from "@chakra-ui/react"
import { FiAlertTriangle } from "react-icons/fi";
import { CiCircleInfo } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineAlert } from "react-icons/ai";

type ToastStatus = "success" | "error" | "warning" | "info"

const statusConfig = {
  success: {
    icon: FaCheckCircle,
    bg: "success.500",
  },
  error: {
    icon: AiOutlineAlert,
    bg: "error.500",
  },
  warning: {
    icon: FiAlertTriangle ,
    bg: "warning.500",
  },
  info: {
    icon: CiCircleInfo,
    bg: "primary.500",
  },
}

interface Props {
  title: string
  description?: string
  status?: ToastStatus
}

export const CustomToast = ({ title, description, status = "info" }: Props) => {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Box
      bg="neutral.900"
      color="white"
      px="4"
      py="3"
      borderRadius="xl"
      boxShadow="lg"
      borderLeft="4px solid"
      borderColor={config.bg}
      minW="300px"
    >
      <HStack align="start" >
        <Icon size={20} color="white" />

        <Box>
          <Text fontSize="sm" fontWeight="semibold">
            {title}
          </Text>

          {description && (
            <Text fontSize="xs" opacity={0.8}>
              {description}
            </Text>
          )}
        </Box>
      </HStack>
    </Box>
  )
}