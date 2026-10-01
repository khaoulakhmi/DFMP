import axios, { type InternalAxiosRequestConfig } from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL

const options = {
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Protection': '1'
    },
}

const api = axios.create(options)

// No interceptors: session checks and refreshes cannot recurse.
const refreshClient = axios.create(options)

type RetryConfig = InternalAxiosRequestConfig & {
    _retry?: boolean
}

let refreshPromise: Promise<void> | null = null

const clearAuthentication = () => {
    window.dispatchEvent(new Event('auth:logout'))
}

const recheckAndRefresh = async (): Promise<void> => {
    try {
        await refreshClient.get('/auth/me')

        // Another tab/request may already have refreshed.
        return
    } catch (error: unknown) {
        if (
            !axios.isAxiosError(error) ||
            error.response?.status !== 401
        ) {
            throw error
        }
    }

    // The access token is unavailable or invalid.
    // The browser sends the HttpOnly refresh cookie.
    await refreshClient.post('/auth/refresh')
}

const refreshAccessToken = (): Promise<void> => {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            if (!navigator.locks) {
                throw new Error(
                    'Session refresh requires Web Locks. ' +
                    'Use a supported browser on localhost or HTTPS.',
                )
            }

            await navigator.locks.request(
                'dfmp-auth-refresh',
                recheckAndRefresh,
            )
        })()
            .catch((error: unknown) => {
                // Network/server errors do not prove the session is invalid.
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 401
                ) {
                    clearAuthentication()
                }

                throw error
            })
            .finally(() => {
                refreshPromise = null
            })
    }

    return refreshPromise
}

api.interceptors.response.use(
    response => response,
    async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error)
        }

        const original = error.config as RetryConfig | undefined

        const requestPath = original?.url?.split('?')[0]?.replace(/\/+$/, '')

        const isAuthenticationRequest = [
            '/auth/login',
            '/auth/logout',
            '/auth/refresh',
        ].some(path => requestPath?.endsWith(path))

        if (
            error.response?.status !== 401 ||
            !original ||
            original._retry ||
            isAuthenticationRequest
        ) {
            return Promise.reject(error)
        }

        original._retry = true

        try {
            await refreshAccessToken()
        } catch (refreshError: unknown) {
            return Promise.reject(refreshError)
        }

        // Retry the original request with the updated cookies.
        return api(original)
    },
)

export default api