import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Box, VStack, Heading, Text, SimpleGrid, Flex, Spinner } from "@chakra-ui/react"
import Button from "@/shared/components/atoms/button"
import TextField from "@/shared/components/molecules/Forms/textField"
import SelectField from "@/shared/components/molecules/Forms/selectField"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { userApi } from "@/api/user.api"
import type { UpdateUserDTO } from "@/shared/types/user.type"
import Switch from "@/shared/components/atoms/switch"

const EditUserPage = () => {
    const { id }         = useParams<{ id: string }>()
    console.log('id from params:', id)
    const navigate       = useNavigate()
    const queryClient    = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm<UpdateUserDTO>()

    // ── Fetch current user data ──
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["users", id],
        queryFn:  () => userApi.getById(id!),
        enabled:  !!id
    })

    // ── Pre-fill form when data loads ──
    useEffect(() => {
        console.log("Fetched user for editing:", user)
        if (user) {
            reset({
                name:     user.name,
                username: user.username,
                role:     user.role,
                status:   user.status,
            })
        }
    }, [user, reset])

    // ── Update mutation ──
    const updateMutation = useMutation({
        mutationFn: (data: UpdateUserDTO) => userApi.update(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            navigate("/users")
        }
    })

    // ── Delete mutation ──
    const deleteMutation = useMutation({
        mutationFn: () => userApi.delete(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            navigate("/users")
        }
    })

    const onSubmit = (data: UpdateUserDTO) => {
        updateMutation.mutate(data)
    }

    // ── Loading ──
    if (isLoading) return (
        <Flex justify="center" align="center" h="64">
            <Spinner color="primary.500" />
        </Flex>
    )

    // ── Error ──
    if (isError || !user) return (
        <Box p={6} bg="error.50" border="1px solid" borderColor="error.200" borderRadius="xl" maxW="700px">
            <Text color="error.600" fontSize="sm" fontWeight="medium">
                User not found or failed to load.
            </Text>
        </Box>
    )

    return (
        <Box p={6}>
            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Users", href: "/users" },
                    { label: "Edit User", isCurrentPage: true },
                ]}
            />

            {/* Page Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Box w="20">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate("/users")}
                    >
                        Back
                    </Button>
                </Box>
                <Box>
                    <Heading
                        fontSize="2xl"
                        fontWeight="semibold"
                        color="neutral.900"
                        fontFamily="heading"
                    >
                        Edit User
                    </Heading>
                    <Text fontSize="sm" color="neutral.600" mt={1}>
                        Editing <strong>{user.name}</strong>
                    </Text>
                </Box>

                {/* Delete button */}
                <Box w="36">
                    <Button
                        variant="danger"
                        size="md"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                            if (window.confirm(`Delete ${user.name}? This cannot be undone.`)) {
                                deleteMutation.mutate()
                            }
                        }}
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete User"}
                    </Button>
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
                    px={8} py={5}
                    bg="neutral.50"
                    borderBottom="1px solid"
                    borderColor="neutral.200"
                >
                    <Text fontSize="sm" fontWeight="medium" color="neutral.700">
                        User Information
                    </Text>
                </Box>

                {/* Card Body */}
                <Box px={8} py={6}>
                    <VStack gap={5} align="stretch">

                        {/* Name + Username */}
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

                       {/* Role + Status */}
                        <SimpleGrid columns={2} gap={4}>
                            <SelectField
                                label="Role"
                                leftIcon={null}
                                {...register("role")}
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="SALES">Sales</option>
                                <option value="FINANCE">Finance</option>
                                <option value="ACCOUNTANT">Accountant</option>
                            </SelectField>

                            {/* 👇 wrap Switch to match SelectField height/label */}
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" color="neutral.700" mb={2}>
                                    Status
                                </Text>
                                <Box
                                    h="10"
                                    display="flex"
                                    alignItems="center"
                                    px={3}
                                    border="1px solid"
                                    borderColor="neutral.300"
                                    borderRadius="md"
                                    bg="white"
                                >
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                label={field.value ? "Active" : "Inactive"}
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                        </SimpleGrid>

                        {/* Change Password — separate section */}
                        <Box
                            p={4}
                            bg="neutral.50"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="neutral.200"
                        >
                            <Text fontSize="sm" fontWeight="medium" color="neutral.700" mb={3}>
                                Change Password
                                <Text as="span" fontSize="xs" color="neutral.400" fontWeight="normal" ml={2}>
                                    (leave blank to keep current)
                                </Text>
                            </Text>
                            <TextField
                                label="New Password"
                                placeholder="Min. 6 characters"
                                type="password"
                                error={errors.password?.message}
                                {...register("password", {
                                    minLength: {
                                        value:   6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                        </Box>

                        {/* Server error */}
                        {updateMutation.isError && (
                            <Box
                                p={3}
                                bg="error.50"
                                border="1px solid"
                                borderColor="error.200"
                                borderRadius="md"
                            >
                                <Text color="error.600" fontSize="sm">
                                    Failed to update user. Please try again.
                                </Text>
                            </Box>
                        )}

                    </VStack>
                </Box>

                {/* Card Footer */}
                <Box
                    px={8} py={5}
                    bg="neutral.50"
                    borderTop="1px solid"
                    borderColor="neutral.200"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {/* Last updated */}
                    <Text fontSize="xs" color="neutral.400">
                        Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                    </Text>

                    <Flex gap={3}>
                        <Box w="28">
                            <Button
                                variant="secondary"
                                size="md"
                                type="button"
                                onClick={() => navigate("/users")}
                            >
                                Cancel
                            </Button>
                        </Box>
                        <Box w="30">
                            <Button
                                variant="primary"
                                size="md"
                                type="submit"
                                disabled={isSubmitting || updateMutation.isPending}
                            >
                                {updateMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </Box>
                    </Flex>
                </Box>

            </Box>
        </Box>
    )
}

export default EditUserPage
