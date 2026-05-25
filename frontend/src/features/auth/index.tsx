import { Flex } from "@chakra-ui/react"
import LoginForm from "./LoginForm"

export default function AuthPage() {
    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="neutral.50"
            px={4}
            py={8}
        >
            <LoginForm />
        </Flex>
    )
}
