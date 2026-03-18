import { Navigate, Outlet } from "react-router-dom"

type Props = {
  role: string
  allowedRoles: string[]
}

export default function RoleGuard({ role, allowedRoles }: Props) {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}