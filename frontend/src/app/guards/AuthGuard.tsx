import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/context/useAuth'

const AuthGuard = () => {
    const { isAuthenticated, isLoading } = useAuth() // 👈 inside component ✅

    if (isLoading) return null

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />
    }

    return <Outlet />
}

export default AuthGuard