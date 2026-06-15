import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react"
import { useMemo, useState, type FormEvent } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import logo from "@/assets/logo2.png"
import Button from "@/shared/components/atoms/button"
import Input from "@/shared/components/atoms/input"
import { useAuth } from "@/shared/context/useAuth"
import { navItems } from "@/shared/utils/navigation"
import type { Role } from "@/shared/types/user.type"

const roleLabels: Record<Role, string> = {
    ADMIN: "Admin",
    SALES: "Sales",
    FINANCE: "Finance",
    ACCOUNTANT: "Accountant",
}

const getInitials = (name?: string) => {
    if (!name) return "?"

    const words = name.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return "?"
    if (words.length === 1) return words[0]?.charAt(0).toUpperCase() ?? "?"

    return `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`.toUpperCase()
}

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [search, setSearch] = useState("")
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const visibleItems = useMemo(() => {
        if (!user) return navItems.slice(0, 1)

        return navItems.filter(item => item.allowedRoles.includes(user.role))
    }, [user])

    const handleSearch = (event: FormEvent<HTMLDivElement>) => {
        event.preventDefault()

        const query = search.trim().toLowerCase()
        if (!query) return

        const match = visibleItems.find(item =>
            item.label.toLowerCase().includes(query) || item.path.toLowerCase().includes(query),
        )

        navigate(match?.path ?? "/")
        setSearch("")
    }

    const handleLogout = async () => {
        setIsLoggingOut(true)

        try {
            await logout()
            navigate("/auth", { replace: true })
        } finally {
            setIsLoggingOut(false)
        }
    }

    const isItemActive = (path: string) => {
        if (path === "/") return location.pathname === "/"
        return location.pathname.startsWith(path)
    }

    return (
        <Box
            as="nav"
            position="sticky"
            top="0"
            zIndex="sticky"
            bg="primary.700"
            color="white"
            px={{ base: 4, md: 6 }}
            pt={3}
            pb={{ base: 2, md: 3 }}
            borderBottom="1px solid"
            borderColor="primary.800"
            boxShadow="sm"
        >
            <Flex align="center" justify="space-between" gap={{ base: 2, md: 4 }}>
                <HStack
                    gap={3}
                    minW="fit-content"
                    cursor="pointer"
                    onClick={() => navigate("/")}
                >
                    <Image
                        src={logo}
                        alt="DFMP logo"
                        boxSize="9"
                        borderRadius="md"
                        objectFit="cover"
                    />
                    <Box>
                        <Text fontWeight="bold" lineHeight="1">
                            DFMP
                        </Text>
                        <Text display={{ base: "none", sm: "block" }} fontSize="xs" color="primary.200" mt={1}>
                            Management Platform
                        </Text>
                    </Box>
                </HStack>

                <Box
                    as="form"
                    role="search"
                    display={{ base: "none", md: "block" }}
                    flex="1"
                    maxW="420px"
                    onSubmit={handleSearch}
                >
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search sections..."
                        size="sm"
                        variant="filled"
                        bg="white"
                        color="neutral.900"
                        rightIcon={
                            <Text as="span" fontSize="xs" color="neutral.500" fontWeight="semibold">
                                Enter
                            </Text>
                        }
                    />
                </Box>

                <HStack gap={{ base: 2, md: 4 }} minW="0">
                    <HStack
                        gap={2.5}
                        py={1}
                        pl={1}
                        pr={{ base: 1, sm: 3 }}
                        borderRadius="full"
                        bg="rgba(255,255,255,0.08)"
                        border="1px solid"
                        borderColor="rgba(255,255,255,0.12)"
                    >
                        <Box
                            w="9"
                            h="9"
                            borderRadius="full"
                            bg="accent.500"
                            color="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="bold"
                            fontSize="sm"
                            flexShrink={0}
                        >
                            {getInitials(user?.name)}
                        </Box>

                        <Box display={{ base: "none", sm: "block" }} minW="0">
                            <Text fontSize="sm" fontWeight="semibold" lineHeight="1.2" maxW="36" truncate>
                                {user?.name ?? "Loading user"}
                            </Text>
                            <Text fontSize="xs" color="primary.200" mt={0.5}>
                                {user?.role ? roleLabels[user.role] : "Signed in"}
                            </Text>
                        </Box>
                    </HStack>

                    <Box w={{ base: "20", sm: "24", md: "28" }} flexShrink={0}>
                        <Button
                            size="sm"
                            variant="secondary"
                            disabled={isLoggingOut}
                            onClick={handleLogout}
                        >
                            {isLoggingOut ? "Signing out" : "Logout"}
                        </Button>
                    </Box>
                </HStack>
            </Flex>

            <HStack
                display={{ base: "flex", md: "none" }}
                gap={2}
                mt={3}
                overflowX="auto"
                pb={1}
                css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
            >
                {visibleItems.map(item => {
                    const active = isItemActive(item.path)

                    return (
                        <Box
                            asChild
                            key={item.path}
                            flexShrink={0}
                            px={3}
                            py={2}
                            borderRadius="md"
                            bg={active ? "white" : "rgba(255,255,255,0.08)"}
                            color={active ? "primary.700" : "white"}
                            border="1px solid"
                            borderColor={active ? "white" : "rgba(255,255,255,0.14)"}
                            fontSize="sm"
                            fontWeight="semibold"
                        >
                            <NavLink to={item.path}>{item.label}</NavLink>
                        </Box>
                    )
                })}
            </HStack>
        </Box>
    )
}

export default Navbar
