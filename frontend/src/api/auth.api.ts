import api from './axios'

export const authApi = {

    login: async (username: string, password: string) => {
        const { data } = await api.post('/auth/login', { username, password })
        localStorage.setItem('accessToken', data.tokens.accessToken)
        return data
    },

    logout: async () => {
        try {
            await api.post('/auth/logout')
        } finally {
            localStorage.removeItem('accessToken')
            window.dispatchEvent(new Event('auth:logout'))
        }
    },

    resetPassword: async (oldPassword: string, newPassword: string) => {
        const { data } = await api.post('/auth/reset-password', {
            oldPassword,
            newPassword
        })
        return data
    }
}
