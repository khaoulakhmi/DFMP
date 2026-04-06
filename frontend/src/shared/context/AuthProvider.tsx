import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '../../api/auth.api'
import { type User } from '@/shared/types/user.type'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    const isAuthenticated = !!localStorage.getItem('accessToken')

    const login = async (username: string, password: string) => {
        const data = await authApi.login(username, password)
        setUser(data.user)
    }

    const logout = async () => {
        await authApi.logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}