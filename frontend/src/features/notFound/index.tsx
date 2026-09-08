import { Box, VStack, Heading, Flex } from "@chakra-ui/react"
import Typography from "@/shared/components/atoms/typography"
import Button from "@/shared/components/atoms/button"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { useI18n } from "@/shared/i18n/useI18n"

const NotFound = () => {
    const navigate = useNavigate()
    const { t } = useI18n()

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
                    {t("common.notFound")}
                </Heading>

                {/* Description */}
                <Typography
                    variant="body-sm"
                    color="neutral.600"
                    maxW="400px"
                >
                    {t("common.notFoundDescription")}
                </Typography>

                {/* Action */}
                <Button
                    variant="primary"
                    onClick={() => navigate(-1)}
                >
                    <Flex align="center" gap={2}>
                        <FiArrowLeft />
                        {t("common.back")}
                    </Flex>
                </Button>

                {/* Optional Home */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                >
                    {t("common.goToDashboard")}
                </Button>

            </VStack>
        </Box>
    )
}

export default NotFound
