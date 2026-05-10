import { Box, VStack, Heading, Flex } from "@chakra-ui/react"
import Typography from "@/shared/components/atoms/typography"
import Button from "@/shared/components/atoms/button"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <Box
            h="calc(100vh - 80px)" // adjust if you have navbar height
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={4}
        >
            <VStack gap={6} textAlign="center">
                
                {/* Big 404 */}
                <Heading
                    fontSize={{ base: "6xl", md: "8xl" }}
                    fontWeight="bold"
                    color="primary.500"
                >
                    404
                </Heading>

                {/* Title */}
                <Heading
                    fontSize="2xl"
                    fontWeight="semibold"
                    color="neutral.800"
                >
                    Page not found
                </Heading>

                {/* Description */}
                <Typography
                    variant="body-sm"
                    color="neutral.600"
                    maxW="400px"
                >
                    The page you are looking for doesn’t exist or has been moved.
                </Typography>

                {/* Action */}
                <Button
                    variant="primary"
                    onClick={() => navigate(-1)}
                >
                    <Flex align="center" gap={2}>
                        <FiArrowLeft />
                        Go Back
                    </Flex>
                </Button>

                {/* Optional Home */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                >
                    Go to Dashboard
                </Button>

            </VStack>
        </Box>
    )
}

export default NotFound