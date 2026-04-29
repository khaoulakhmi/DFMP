import { userApi } from "@/api/user.api"
import Button from "@/shared/components/atoms/button"
import Typography from "@/shared/components/atoms/typography"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import TextField from "@/shared/components/molecules/Forms/textField"
import type { CreateUserDTO } from "@/shared/types/user.type"
import { Box, VStack, Text, SimpleGrid, Flex } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toaster } from "@/components/ui/toaster"

const CreateUserPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateUserDTO>()

    const navigate = useNavigate()
    const onSubmit = async (data: CreateUserDTO) => {
        const user = await userApi.create(data)

        if (user) {
        toaster.create({
            title: "User created",
            description: `${user.name} has been created successfully.`,
            type: "success",
        })
        navigate("/users") 
    }
    }

    return (
        <Box>
            {/* Page Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Box w="10" h="10">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate("/users")}
                    >
                        ←
                    </Button>
                </Box>
                <Box mb={6}>
                    <Typography
                        variant={"heading"}
                    >
                        Create User
                    </Typography>
                    <Typography variant={"body-sm"} color="text.secondary">
                        Add a new user to the system
                    </Typography>
                </Box>              
            </Flex>
           

            {/* Form Card */}
            <Box
                as="form"
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="neutral.200"
                overflow="hidden"
                // maxW="700px"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Card Header */}
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

                {/* Card Body */}
                <Box px={8} py={6}>
                    <VStack gap={5} align="stretch">

                        {/* Name + Username side by side */}
                        <SimpleGrid columns={2} gap={4}>
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

                        {/* Password */}
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

                        {/* Role */}
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

                {/* Card Footer */}
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
                            {isSubmitting ? 'Creating...' : 'Create User'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CreateUserPage