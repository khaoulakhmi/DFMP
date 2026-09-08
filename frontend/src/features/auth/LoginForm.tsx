import { useForm } from "react-hook-form"
import { Box, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react"
import TextField from "@/shared/components/molecules/Forms/textField"
import Button from "@/shared/components/atoms/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/shared/context/useAuth"
import { FiEye, FiEyeOff, FiLock, FiLogIn, FiUser } from "react-icons/fi"
import logo from "@/assets/logo2.png"
import { useI18n } from "@/shared/i18n/useI18n"

type FormValues = {
    username: string
    password: string
}

const getLoginErrorMessage = (error: unknown, fallback: string) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "error" in error.response.data &&
        typeof error.response.data.error === "string"
    ) {
        return error.response.data.error
    }

    if (error instanceof Error && error.message) {
        return error.message
    }

    return fallback
}

const LoginForm = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const { t } = useI18n()
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<FormValues>({
        mode: "onBlur",
    })

    const onSubmit = async (data: FormValues) => {
        try {
            await login(data.username.trim(), data.password)
            navigate("/")
        } catch (err) {
            setError("root", {
                message: getLoginErrorMessage(err, t("auth.loginFailed")),
            })
        }
    }

    return (
        <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg="white"
            border="1px solid"
            borderColor="neutral.200"
            borderRadius="lg"
            boxShadow="md"
            w="full"
            maxW="400px"
            mx="auto"
            p={{ base: 6, sm: 8 }}
            position="relative"
            overflow="hidden"
        >
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="1"
                bg="primary.500"
            />

            <VStack gap={6} align="stretch">
                <VStack gap={3} align="center">
                    <HStack gap={3}>
                        <Image
                            src={logo}
                            alt="DFMP logo"
                            boxSize="11"
                            borderRadius="md"
                            objectFit="cover"
                        />
                        <Box>
                            <Text fontSize="xl" fontWeight="bold" color="neutral.900" lineHeight="1">
                                DFMP
                            </Text>
                            <Text fontSize="xs" color="primary.600" fontWeight="semibold" mt={1}>
                                {t("auth.platform")}
                            </Text>
                        </Box>
                    </HStack>

                    <Box textAlign="center" pt={2}>
                        <Heading size="lg" color="neutral.900" fontWeight="semibold">
                            {t("auth.welcomeBack")}
                        </Heading>
                        <Text fontSize="sm" color="neutral.500">
                            {t("auth.signInDescription")}
                        </Text>
                    </Box>
                </VStack>

                <VStack gap={4} align="stretch">
                    <TextField
                        label={t("users.username")}
                        placeholder={t("auth.usernamePlaceholder")}
                        autoComplete="username"
                        error={errors.username?.message}
                        state={errors.username ? "error" : "default"}
                        leftIcon={<FiUser />}
                        required
                        showRequiredIndicator
                        disabled={isSubmitting}
                        {...register("username", {
                            required: t("auth.usernameRequired"),
                            setValueAs: value => typeof value === "string" ? value.trim() : value,
                        })}
                    />
                    <TextField
                        label={t("users.password")}
                        placeholder={t("auth.passwordPlaceholder")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        error={errors.password?.message}
                        state={errors.password ? "error" : "default"}
                        leftIcon={<FiLock />}
                        rightIcon={
                            <button
                                type="button"
                                style={{
                                    color: "inherit",
                                    display: "flex",
                                    alignItems: "center",
                                    border: 0,
                                    background: "transparent",
                                    padding: 0,
                                    cursor: "pointer",
                                }}
                                onClick={() => setShowPassword(value => !value)}
                                aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        }
                        required
                        showRequiredIndicator
                        disabled={isSubmitting}
                        {...register("password", {
                            required: t("auth.passwordRequired"),
                            minLength: {
                                value: 4,
                                message: t("auth.passwordMinLength"),
                            },
                        })}
                    />
                </VStack>

                {errors.root && (
                    <Text color="error.600" fontSize="sm" textAlign="center" fontWeight="medium">
                        {errors.root.message}
                    </Text>
                )}

                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                    <HStack gap={2} justify="center">
                        <FiLogIn />
                        <Text as="span">{isSubmitting ? t("common.signingIn") : t("common.login")}</Text>
                    </HStack>
                </Button>
            </VStack>
        </Box>
    )
}

export default LoginForm
