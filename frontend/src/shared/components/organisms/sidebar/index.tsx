import { Box, VStack, Text } from "@chakra-ui/react"
import { NavLink, useLocation } from "react-router-dom"
import { navItems } from "@/shared/utils/navigation"
import { useAuth } from "@/shared/context/useAuth"
import type { Role } from "@/shared/types/user.type"

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

  const visibleItems = navItems.filter(item =>
    item.allowedRoles.includes(user?.role as Role)
  )

  const isItemActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Box
      as="aside"
      display={{ base: "none", md: "block" }}
      w="64"
      flexShrink={0}
      minH="100vh"
      bg="neutral.200"
      borderRight="1px solid"
      borderColor="neutral.300"
      py={6}
      px={3}
    >
      <VStack align="stretch" gap={1} mt={4}>
        {visibleItems.map(item => {
          const active = isItemActive(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <Box
                position="relative"
                px={3}
                py={2.5}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                gap={3}
                bg={active ? "accent.500" : "transparent"}
                color={active ? "white" : "text.secondary"}
                _hover={{
                  bg: "primary.700",
                  color: "white",
                }}
                transition="all 0.2s"
              >
                {/* Icon */}
                {item.icon && (
                  <Box fontSize="md">{item.icon}</Box>
                )}

                {/* Label */}
                <Text fontSize="sm" fontWeight="medium">
                  {item.label}
                </Text>

                {/* Active indicator */}
                {active && (
                  <Box
                    position="absolute"
                    left="0"
                    top="50%"
                    transform="translateY(-50%)"
                    w="1"
                    h="5"
                    bg="white"
                    borderRadius="full"
                  />
                )}
              </Box>
            </NavLink>
          )
        })}
      </VStack>
    </Box>
  )
}

export default Sidebar
