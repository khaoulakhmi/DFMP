import { createBrowserRouter } from "react-router-dom"

// layouts
import AuthLayout from "@/layouts/AuthLayout"
import DashboardLayout from "@/layouts/DashboardLayout"

// pages
import AuthPage from "@/features/auth"
// import Dashboard from "@/features/dashboard"
// import Reports from "@/features/reports"
// import Settings from "@/features/settings"

// guards
import AuthGuard from "@/app/guards/AuthGuard"
import RoleGuard from "@/app/guards/roleGuard"

// fake state (later replace with store)
const isAuthenticated = true
const userRole = "admin" // "user" | "admin"

export const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <AuthPage />,
      },
    ],
  },

  // PROTECTED ROUTES
  {
    element: <AuthGuard isAuthenticated={isAuthenticated} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
        //   {
        //     path: "/",
        //     element: <Dashboard />,
        //   },

        //   {
        //     path: "/reports",
        //     element: <Reports />,
        //   },

        //   {
        //     path: "/settings",
        //     element: <Settings />,
        //   },

          // 🔥 ROLE BASED ROUTE
          {
            element: (
              <RoleGuard role={userRole} allowedRoles={["admin"]} />
            ),
            children: [
              {
                path: "/users",
                element: <div>Users Page (Admin Only)</div>,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <div>Not Found</div>,
  },
])