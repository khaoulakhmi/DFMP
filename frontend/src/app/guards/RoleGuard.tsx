import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/context/useAuth'

interface RoleGuardProps {
    allowedRoles: string[]
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
    const { user, isLoading } = useAuth() // 👈 inside component ✅

    if (isLoading) return null

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default RoleGuard