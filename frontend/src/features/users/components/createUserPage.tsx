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
import { useI18n } from "@/shared/i18n/useI18n"

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

    const { t } = useI18n()
    
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
            title: t("users.created"),
            description: `${user.name} ${t("users.successAdd")}`,
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
                            {t("common.back")}
                        </Button>
                    </Box>
                    <Box mb={6}>
                        <Typography variant="heading">
                            {t("users.add")}
                        </Typography>
                        <Typography variant="body-sm" color="text.secondary">
                            {t("users.addDescription")}
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
                        {t("users.information")}
                    </Text>
                </Box>

                <Box px={8} py={6}>
                    <VStack gap={5} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <TextField
                                label={t("common.name")}
                                placeholder={t("users.fullNamePlaceholder")}
                                error={errors.name?.message}
                                {...register("name", {
                                    required: t("validation.required", { field: t("common.name") })
                                })}
                            />
                            <TextField
                                label={t("users.username")}
                                placeholder={t("users.usernamePlaceholder")}
                                error={errors.username?.message}
                                {...register("username", {
                                    required: t("validation.required", { field: t("users.username") })
                                })}
                            />
                        </SimpleGrid>

                        <TextField
                            label={t("users.password")}
                            placeholder={t("users.passwordMinLength")}
                            type="password"
                            error={errors.password?.message}
                            {...register("password", {
                                required: t("validation.required", { field: t("users.password") }),
                                minLength: {
                                    value: 6,
                                    message: t("users.passwordTooShort")
                                }
                            })}
                        />

                        <SelectField
                            label={t("users.role")}
                            leftIcon={null}
                            {...register("role", {
                                required: t("validation.required", { field: t("users.role") })
                            })}
                        >
                            <option value="">{t("common.selectRole")}</option>
                            <option value="ADMIN">{t("roles.ADMIN")}</option>
                            <option value="SALES">{t("roles.SALES")}</option>
                            <option value="FINANCE">{t("roles.FINANCE")}</option>
                            <option value="ACCOUNTANT">{t("roles.ACCOUNTANT")}</option>
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
                            {t("common.cancel")}
                        </Button>
                    </Box>
                    <Box w="32">
                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t("users.creating") : t("users.create")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CreateUserPage
