// shared/config/navigation.ts
import { Role } from "@/shared/types/user.type"
import { BiSolidReport } from "react-icons/bi"
import { FaUsers, FaBoxOpen  } from "react-icons/fa6"
import { FcBusinessman, FcSalesPerformance } from "react-icons/fc"
import { FaLayerGroup } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi2"
import { MdBusinessCenter, MdCategory  } from "react-icons/md"
import { RiDashboardFill } from "react-icons/ri"

export const navItems = [
    {
        label: "Dashboard",
        icon: <RiDashboardFill />,
        path: "/",
        allowedRoles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.ACCOUNTANT],
    },
    {
        label: "Users",
        icon: <FaUsers />,
        path: "/users",
        allowedRoles: [Role.ADMIN],
    },
    {        
        label: "Providers",
        icon: <FcBusinessman />,
        path: "/providers",
        allowedRoles: [Role.ADMIN, Role.SALES],
    },
    {
        label: "Designations",
        icon: <MdCategory />,
        path: "/designations",
        allowedRoles: [Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT],
    },
    {
        label: "Lots",
        icon: <FaLayerGroup />,
        path: "/lots",
        allowedRoles: [Role.ADMIN, Role.SALES],
    },
    {        
        label: "Products",
        icon: <FaBoxOpen />,
        path: "/products",
        allowedRoles: [Role.ADMIN, Role.SALES],
    },
    {
        label: "Specifications",
        icon: <HiDocumentText />,
        path: "/specifications",
        allowedRoles: [Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT],
    },
    {
        label: "Sales",
        icon: <FcSalesPerformance />,
        path: "/sales",
        allowedRoles: [Role.ADMIN, Role.SALES],
    },
    {
        label: "Finance",
        icon: <MdBusinessCenter />,
        path: "/finance",
        allowedRoles: [Role.ADMIN, Role.FINANCE],
    },
    {
        label: "Reports",
        icon: <BiSolidReport />,
        path: "/reports",
        allowedRoles: [Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT],
    },
]
