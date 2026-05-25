import { useForm } from "react-hook-form"
import { Box, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react"
import TextField from "@/shared/components/molecules/Forms/textField"
import Button from "@/shared/components/atoms/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/shared/context/useAuth"
import { FiEye, FiEyeOff, FiLock, FiLogIn, FiUser } from "react-icons/fi"
import logo from "@/assets/logo2.png"

type FormValues = {
    username: string
    password: string
}

const getLoginErrorMessage = (error: unknown) => {
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

    return "Login failed. Please check your credentials and try again."
}

const LoginForm = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
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
                message: getLoginErrorMessage(err),
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
                                Management Platform
                            </Text>
                        </Box>
                    </HStack>

                    <Box textAlign="center" pt={2}>
                        <Heading size="lg" color="neutral.900" fontWeight="semibold">
                            Welcome back
                        </Heading>
                        <Text fontSize="sm" color="neutral.500">
                            Sign in to continue to DFMP
                        </Text>
                    </Box>
                </VStack>

                <VStack gap={4} align="stretch">
                    <TextField
                        label="Username"
                        placeholder="Enter your username"
                        autoComplete="username"
                        error={errors.username?.message}
                        state={errors.username ? "error" : "default"}
                        leftIcon={<FiUser />}
                        required
                        showRequiredIndicator
                        disabled={isSubmitting}
                        {...register("username", {
                            required: "Username is required",
                            setValueAs: value => typeof value === "string" ? value.trim() : value,
                        })}
                    />
                    <TextField
                        label="Password"
                        placeholder="Enter your password"
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
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        }
                        required
                        showRequiredIndicator
                        disabled={isSubmitting}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 4,
                                message: "Password must be at least 4 characters",
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
                        <Text as="span">{isSubmitting ? "Signing in..." : "Sign in"}</Text>
                    </HStack>
                </Button>
            </VStack>
        </Box>
    )
}

export default LoginForm
