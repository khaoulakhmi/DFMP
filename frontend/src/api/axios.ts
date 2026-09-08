import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

// Refresh requests use an interceptor-free client to prevent refresh loops.
const refreshClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

let refreshPromise: Promise<string> | null = null

const clearAuthentication = () => {
    localStorage.removeItem('accessToken')
    window.dispatchEvent(new Event('auth:logout'))
}

const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const { data } = await refreshClient.post<{ accessToken: string }>(
                '/auth/refresh'
            )

            if (!data.accessToken) {
                throw new Error('Refresh response did not include an access token')
            }

            localStorage.setItem('accessToken', data.accessToken)
            return data.accessToken
        })()
            .catch((error: unknown) => {
                clearAuthentication()
                throw error
            })
            .finally(() => {
                refreshPromise = null
            })
    }

    return refreshPromise
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        const isAuthenticationRequest = ['/auth/login', '/auth/logout', '/auth/refresh']
            .some(path => original?.url?.endsWith(path))

        if (error.response?.status === 401 && original && !original._retry && !isAuthenticationRequest) {
            original._retry = true

            try {
                const accessToken = await refreshAccessToken()
                original.headers.Authorization = `Bearer ${accessToken}`
                return api(original)
            } catch {
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)

export default api
