import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom"

import AuthGuard from "@/app/guards/AuthGuard"
import GuestGuard from "@/app/guards/GuestGuard"
import RoleGuard from "@/app/guards/RoleGuard"
import AuthPage from "@/features/auth"
import Dashboard from "@/features/dashboard"
import Designation from "@/features/designation"
import EditDesignationPage from "@/features/designation/components/editDesignationPage"
import DesignationExplorer from "@/features/designation/components/designationExplorer"
import Lot from "@/features/lot"
import NotFound from "@/features/notFound"
import Product from "@/features/product"
import ProductDetailPage from "@/features/product/components/ProductDetailPage"
import EditProductPage from "@/features/product/components/EditProductPage"
import Provider from "@/features/provider"
import CreateProviderPage from "@/features/provider/components/createProviderPage"
import EditProviderPage from "@/features/provider/components/editProviderPage"
import ProviderList from "@/features/provider/components/providerList"
import Specifications from "@/features/specifications"
import UsersPage from "@/features/users"
import EditUserPage from "@/features/users/components/editUserPage"
import AuthLayout from "@/layouts/AuthLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import RootLayout from "@/layouts/RootLayout"
import { Role } from "@/shared/types/user.type"
import CreateProductPage from "@/features/product/components/createProduct"
// import CreateProductPage from "@/features/product/components/createProductPage"

const paths = {
    auth: "/auth",
    dashboard: "/",
    users: "/users",
    userCreate: "/users/create",
    userEdit: "/users/:id/edit",
    providers: "/providers",
    providerCreate: "create",
    providerEdit: ":id/edit",
    lots: "/lots",
    products: "/products",
    productDetails: "/products/:id",
    productCreate: "/product/create",
    productEdit: "/products/:id/edit",
    designations: "/designations",
    designationCreate: "create",
    designationEdit: ":id/edit",
    specifications: "/specifications",
} as const

const adminOnly = [Role.ADMIN]
const adminAndSales = [Role.ADMIN, Role.SALES]
const adminFinanceAndAccounting = [Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT]

const guestRoutes: RouteObject[] = [
    {
        element: <GuestGuard />,
        children: [
            {
                path: paths.auth,
                element: <AuthLayout />,
                children: [{ index: true, element: <AuthPage /> }],
            },
        ],
    },
]

const adminRoutes: RouteObject = {
    element: <RoleGuard allowedRoles={adminOnly} />,
    children: [
        { path: paths.users, element: <UsersPage /> },
        { path: paths.userCreate, element: <Navigate to="/users?tab=create" replace /> },
        { path: paths.userEdit, element: <EditUserPage /> },
    ],
}

const salesRoutes: RouteObject = {
    element: <RoleGuard allowedRoles={adminAndSales} />,
    children: [
        {
            path: paths.providers,
            element: <Provider />,
            children: [
                { index: true, element: <ProviderList /> },
                { path: paths.providerCreate, element: <CreateProviderPage /> },
                { path: paths.providerEdit, element: <EditProviderPage /> },
            ],
        },
        { path: paths.lots, element: <Lot /> },
        { path: paths.products, element: <Product /> },
        { path: paths.productCreate, element: <CreateProductPage/>},
        { path: paths.productDetails, element: <ProductDetailPage /> },
        { path: paths.productEdit, element: <EditProductPage /> },
    ],
}

const financeRoutes: RouteObject = {
    element: <RoleGuard allowedRoles={adminFinanceAndAccounting} />,
    children: [
        {
            path: paths.designations,
            element: <Designation />,
            children: [
                { index: true, element: <DesignationExplorer /> },
                { path: paths.designationCreate, element: <Navigate to="/designations" replace /> },
                { path: paths.designationEdit, element: <EditDesignationPage /> },
            ],
        },
        { path: paths.specifications, element: <Specifications /> },
    ],
}

const protectedRoutes: RouteObject[] = [
    {
        element: <AuthGuard />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { path: paths.dashboard, element: <Dashboard /> },
                    adminRoutes,
                    salesRoutes,
                    financeRoutes,
                ],
            },
        ],
    },
]

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            ...guestRoutes,
            ...protectedRoutes,
            { path: "*", element: <NotFound /> },
        ],
    },
])
