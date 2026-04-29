import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import Button from "@/shared/components/atoms/button"
import { useNavigate } from "react-router-dom"
import UsersList from "@/features/users/components/UsersList"

const UsersPage = () => {
    const navigate = useNavigate()

    return (
        <Box p={6}>

            {/* Page Header */}
            <Flex
                justify="space-between"
                align="center"
                mb={6}
            >
                <Box>
                    <Heading
                        fontSize="2xl"
                        fontWeight="semibold"
                        color="neutral.900"
                        fontFamily="heading"
                    >
                        Users
                    </Heading>
                    <Text fontSize="sm" color="neutral.600" mt={1}>
                        Manage system users and their roles
                    </Text>
                </Box>

                {/* Create User Button */}
                <Box w="36">
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/users/create")}
                    >
                        + Create User
                    </Button>
                </Box>
            </Flex>

            {/* Users List */}
            <UsersList />

        </Box>
    )
}

export default UsersPage