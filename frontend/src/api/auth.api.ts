import api from './axios'

export const authApi = {

    me: async () => {
        const { data } = await api.get('/auth/me')
        return data.user
    },

    login: async (username: string, password: string) => {
        const { data } = await api.post('/auth/login', { username, password })
        return data
    },

    logout: async () => {
        await api.post('/auth/logout')
        window.dispatchEvent(new Event('auth:logout'))
    },

    resetPassword: async (oldPassword: string, newPassword: string) => {
        const { data } = await api.post('/auth/reset-password', {
            oldPassword,
            newPassword
        })
        return data
    }
}
