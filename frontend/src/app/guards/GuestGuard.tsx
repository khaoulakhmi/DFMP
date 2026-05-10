// src/app/guards/GuestGuard.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/context/useAuth'

const GuestGuard = () => {
    const { isAuthenticated } = useAuth()

    // if already logged in → redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default GuestGuard