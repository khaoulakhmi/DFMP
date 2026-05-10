import Navbar from "@/shared/components/organisms/navbar"
import Sidebar from "@/shared/components/organisms/sidebar"
import { Box, HStack } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"


const DashboardLayout = () => {
  return (
    <>
      <Navbar />

      <HStack align="stretch" >
        <Sidebar />

        {/* MAIN AREA */}
        <Box flex="1" bg="neutral.50" minH="calc(100vh - 64px)">
          
          {/* CENTERED CONTAINER */}
          <Box
            maxW="1100px"
            mx="auto"     // 👈 THIS CENTERS EVERYTHING
            px={6}
            py={6}
          >
            <Outlet />
          </Box>

        </Box>
      </HStack>
    </>
  )
}

export default DashboardLayout