// shared/config/navigation.ts
import { Role } from '@/shared/types/user.type'
import { RiDashboardFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { FcSalesPerformance } from "react-icons/fc";
import { BiSolidReport } from "react-icons/bi";
import { MdBusinessCenter } from "react-icons/md";
import { FcBusinessman } from "react-icons/fc";


export const navItems = [
    {
        label: 'Dashboard',
        icon: <RiDashboardFill/>,
        path: '/',
        allowedRoles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.ACCOUNTANT]
    },
    {
        label: 'Users',
        icon: <FaUsers/>,
        path: '/users',
        allowedRoles: [Role.ADMIN]                          // admin only
    },
    {        
        label: 'Providers',
        icon: <FcBusinessman/>,
        path: '/providers',
        allowedRoles: [Role.ADMIN, Role.SALES]
    },
    {
        label: 'Sales',
        icon: <FcSalesPerformance/>,
        path: '/sales',
        allowedRoles: [Role.ADMIN, Role.SALES]              // admin + sales
    },
    {
        label: 'Finance',
        icon: <MdBusinessCenter/>,
        path: '/finance',
        allowedRoles: [Role.ADMIN, Role.FINANCE]            // admin + finance
    },
    {
        label: 'Reports',
        icon: <BiSolidReport/>,
        path: '/reports',
        allowedRoles: [Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT]
    },
]