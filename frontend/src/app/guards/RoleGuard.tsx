import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/context/useAuth'

interface RoleGuardProps {
    allowedRoles: string[]
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
    const { user } = useAuth() // 👈 inside component ✅

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default RoleGuard