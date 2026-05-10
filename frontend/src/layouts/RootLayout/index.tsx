// src/app/layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/shared/context/AuthProvider'
import { AuthListener } from '@/shared/hooks/AuthListener'
import { Toaster } from '@/components/ui/toaster'

const RootLayout = () => {
    return (
        <AuthProvider>       {/* 👈 AuthProvider inside router tree */}
            <AuthListener /> {/* 👈 works now, inside router */}
            <Toaster />       {/* 👈 Toaster can be used anywhere in the app */}
            <Outlet />
        </AuthProvider>
    )
}

export default RootLayout