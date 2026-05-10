import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/context/useAuth'

const AuthGuard = () => {
    const { isAuthenticated } = useAuth() // 👈 inside component ✅

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />
    }

    return <Outlet />
}

export default AuthGuard