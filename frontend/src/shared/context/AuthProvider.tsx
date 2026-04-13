import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '@/api/auth.api'
import { type User } from '@/shared/types/user.type'
import { jwtDecode } from 'jwt-decode'

// helper — checks if token exists AND is not expired
const isTokenValid = (): boolean => {
    const token = localStorage.getItem('accessToken')
    console.log('Checking token validity:', token) // debug log
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    
    console.log('AuthProvider rendered, user:', user) // debug log
    console.log('Is token valid?', isTokenValid()) // debug log
    const isAuthenticated = isTokenValid() // 👈 replaced

    const login = async (username: string, password: string) => {
        const data = await authApi.login(username, password)
        console.log('Login successful, user data:', data) // debug log
        setUser(data.user) // 👈 updated to use data.user
    }

    const logout = async () => {
        await authApi.logout()
        setUser(null)
        localStorage.removeItem('accessToken')  // 👈 added
        localStorage.removeItem('refreshToken') // 👈 added
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}