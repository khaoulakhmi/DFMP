import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '@/api/auth.api'
import { type User } from '@/shared/types/user.type'
import { jwtDecode } from 'jwt-decode'
import { userApi } from '@/api/user.api'

type AuthTokenPayload = {
    userId: string
    role: User['role']
    exp: number
}

// helper — checks if token exists AND is not expired
const isTokenValid = (): boolean => {
    const token = localStorage.getItem('accessToken')
    if (!token) return false

    try {
        const decoded = jwtDecode<{ exp: number }>(token)
        const now = Date.now() / 1000

        if (decoded.exp <= now) {
            localStorage.removeItem('accessToken')  // clean expired token
            return false
        }

        return true
    } catch {
        localStorage.removeItem('accessToken')      // clean invalid token
        return false
    }
}

const getUserFromToken = async (): Promise<User | null> => {
    const token = localStorage.getItem('accessToken')
    if (!token) return null

    try {
        const decoded = jwtDecode<AuthTokenPayload>(token)
        const now = Date.now() / 1000

        if (decoded.exp <= now) {
            localStorage.removeItem('accessToken')
            return null
        }

        const user = await userApi.getById(decoded.userId) // 👈 fetch full user data if needed
        return user // 👈 return the fetched user data
    } catch {
        localStorage.removeItem('accessToken')
        return null
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromToken()
            setUser(user)
        }

        fetchUser()

        const handleLogout = () => setUser(null)
        window.addEventListener('auth:logout', handleLogout)
        return () => window.removeEventListener('auth:logout', handleLogout)
    }, [])

    const isAuthenticated = isTokenValid() // 👈 replaced

    const login = async (username: string, password: string) => {
        const data = await authApi.login(username, password)
        setUser(data.user) // 👈 updated to use data.user
    }

    const logout = async () => {
        await authApi.logout()
        setUser(null)
        localStorage.removeItem('accessToken')  // 👈 added
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
