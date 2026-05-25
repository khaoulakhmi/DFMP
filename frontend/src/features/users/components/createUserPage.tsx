import { userApi } from "@/api/user.api"
import Button from "@/shared/components/atoms/button"
import Typography from "@/shared/components/atoms/typography"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import TextField from "@/shared/components/molecules/Forms/textField"
import type { CreateUserDTO } from "@/shared/types/user.type"
import { Box, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"

interface CreateUserPageProps {
    onCancel?: () => void;
    onSuccess?: () => void;
    showHeader?: boolean;
}

const CreateUserPage = ({
    onCancel,
    onSuccess,
    showHeader = true,
}: CreateUserPageProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateUserDTO>()

    const navigate = useNavigate()

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
            return
        }

        navigate("/users")
    }

    const onSubmit = async (data: CreateUserDTO) => {
        const user = await userApi.create(data)

        if (!user) return

        toaster.create({
            title: "User created",
            description: `${user.name} has been created successfully.`,
            type: "success",
        })

        if (onSuccess) {
            onSuccess()
            return
        }

        navigate("/users")
    }

    return (
        <Box>
            {showHeader && (
                <Flex justify="space-between" align="center" mb={6}>
                    <Box w="20">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancel}
                        >
                            Back
                        </Button>
                    </Box>
                    <Box mb={6}>
                        <Typography variant="heading">
                            Create User
                        </Typography>
                        <Typography variant="body-sm" color="text.secondary">
                            Add a new user to the system
                        </Typography>
                    </Box>
                </Flex>
            )}

            <Box
                as="form"
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="neutral.200"
                overflow="hidden"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box
                    px={8}
                    py={5}
                    bg="neutral.50"
                    borderBottom="1px solid"
                    borderColor="neutral.200"
                >
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="neutral.700"
                    >
                        User Information
                    </Text>
                </Box>

                <Box px={8} py={6}>
                    <VStack gap={5} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <TextField
                                label="Full Name"
                                placeholder="Enter full name"
                                error={errors.name?.message}
                                {...register("name", {
                                    required: "Name is required"
                                })}
                            />
                            <TextField
                                label="Username"
                                placeholder="Enter username"
                                error={errors.username?.message}
                                {...register("username", {
                                    required: "Username is required"
                                })}
                            />
                        </SimpleGrid>

                        <TextField
                            label="Password"
                            placeholder="Min. 6 characters"
                            type="password"
                            error={errors.password?.message}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />

                        <SelectField
                            label="Role"
                            leftIcon={null}
                            {...register("role", {
                                required: "Role is required"
                            })}
                        >
                            <option value="">Select a role</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SALES">Sales</option>
                            <option value="FINANCE">Finance</option>
                            <option value="ACCOUNTANT">Accountant</option>
                        </SelectField>
                    </VStack>
                </Box>

                <Box
                    px={8}
                    py={5}
                    bg="neutral.50"
                    borderTop="1px solid"
                    borderColor="neutral.200"
                    display="flex"
                    justifyContent="flex-end"
                    gap={3}
                >
                    <Box w="32">
                        <Button
                            variant="secondary"
                            size="md"
                            type="button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Box>
                    <Box w="32">
                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create User"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CreateUserPage
