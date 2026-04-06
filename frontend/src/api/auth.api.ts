import api from './axios'

export const authApi = {

    login: async (username: string, password: string) => {
        const { data } = await api.post('/auth/login', { username, password })
        // save tokens
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        return data
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        await api.post('/auth/logout', { refreshToken })
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    },

    resetPassword: async (oldPassword: string, newPassword: string) => {
        const { data } = await api.post('/auth/reset-password', {
            oldPassword,
            newPassword
        })
        return data
    }
}