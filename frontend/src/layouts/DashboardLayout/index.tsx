import { AuthListener } from "@/shared/hooks/AuthListener"
import { Outlet } from "react-router-dom"


const DashboardLayout = () => {

    return (
        <>
        <AuthListener/>
        <Outlet/>
        </>
    )
}


export default DashboardLayout