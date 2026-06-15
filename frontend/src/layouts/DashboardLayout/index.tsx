import Navbar from "@/shared/components/organisms/navbar"
import Sidebar from "@/shared/components/organisms/sidebar"
import { Box, HStack } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"


const DashboardLayout = () => {
  return (
    <>
      <Navbar />

      <HStack align="stretch" gap={0}>
        <Sidebar />

        {/* MAIN AREA */}
        <Box flex="1" minW={0} bg="neutral.50" minH="calc(100vh - 64px)">
          
          {/* CENTERED CONTAINER */}
          <Box
            w="full"
            maxW="1100px"
            mx="auto"     // 👈 THIS CENTERS EVERYTHING
            px={{ base: 3, sm: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
          >
            <Outlet />
          </Box>

        </Box>
      </HStack>
    </>
  )
}

export default DashboardLayout
