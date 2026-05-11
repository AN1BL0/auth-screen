import { computed, ref } from 'vue'
import { apiRequest } from '../api/http'

interface User {
    id: string
    name: string
    email: string
}

interface AuthResponse {
    user: User
    token: string
}

interface MeResponse {
    user: User
}

interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    name: string
    email: string
    password: string
}

const TOKEN_STORAGE_KEY = 'auth-token'

const token = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))
const user = ref<User | null>(null)

const isAuthenticated = computed(() => {
    return Boolean(token.value)
})

function setAuthData(authData: AuthResponse) {
    user.value = authData.user
    token.value = authData.token

    localStorage.setItem(TOKEN_STORAGE_KEY, authData.token)
}

function clearAuthData() {
    user.value = null
    token.value = null

    localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function useAuth() {
    async function register(payload: RegisterPayload) {
        const authData = await apiRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        })

        setAuthData(authData)
    }

    async function login(payload: LoginPayload) {
        const authData = await apiRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        })

        setAuthData(authData)
    }

    async function fetchMe() {
        if (!token.value) {
            return null
        }

        try {
            const data = await apiRequest<MeResponse>('/auth/me', {
                token: token.value,
            })

            user.value = data.user

            return data.user
        } catch {
            clearAuthData()

            return null
        }
    }

    async function logout() {
        if (token.value) {
            await apiRequest<void>('/auth/logout', {
                method: 'POST',
                token: token.value,
            }).catch(() => null)
        }

        clearAuthData()
    }

    return {
        user,
        token,
        isAuthenticated,
        register,
        login,
        fetchMe,
        logout,
    }
}