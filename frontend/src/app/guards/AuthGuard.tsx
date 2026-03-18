import { Navigate, Outlet } from "react-router-dom"

type Props = {
  isAuthenticated: boolean
}

export default function AuthGuard({ isAuthenticated }: Props) {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}