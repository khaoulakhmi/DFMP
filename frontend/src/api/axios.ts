import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' }
})

// REQUEST interceptor → attach access token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// RESPONSE interceptor → handle expired token automatically
api.interceptors.response.use(
    (response) => response, // ✅ success → return normally

    async (error) => {
        const original = error.config

        // if 401 and not already retried
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                const { data } = await axios.post(
                    'http://localhost:4000/api/auth/refresh',
                    { refreshToken }
                )

                // save new access token
                localStorage.setItem('accessToken', data.accessToken)

                // retry original request with new token
                original.headers.Authorization = `Bearer ${data.accessToken}`
                return api(original)

            } catch (err) {
                // refresh failed → force logout
                console.error('Token refresh failed:', err)
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.dispatchEvent(new Event('auth:logout'))

            }
        }

        return Promise.reject(error)
    }
)

export default api