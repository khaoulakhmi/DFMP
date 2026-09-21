import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '@/api/auth.api'
import { type User } from '@/shared/types/user.type'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let active = true
        const handleLogout = () => {
            active = false
            setUser(null)
            setIsLoading(false)
        }
        window.addEventListener('auth:logout', handleLogout)

        authApi.me()
            .then((user: User) => { if (active) setUser(user) })
            .catch(() => { if (active) setUser(null) })
            .finally(() => { if (active) setIsLoading(false) })

        return () => {
            active = false
            window.removeEventListener('auth:logout', handleLogout)
        }
    }, [])

    const login = async (username: string, password: string) => {
        const data = await authApi.login(username, password)
        setUser(data.user)
    }

    const logout = async () => {
        await authApi.logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
