import { computed, ref } from 'vue'

interface User {
name: string
email: string
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

const AUTH_STORAGE_KEY = 'auth-user'

function getInitialUser(): User | null {
const savedUser = localStorage.getItem(AUTH_STORAGE_KEY)

if (!savedUser) {
return null
}

try {
return JSON.parse(savedUser) as User
} catch {
localStorage.removeItem(AUTH_STORAGE_KEY)
return null
}
}

const user = ref<User | null>(getInitialUser())

const isAuthenticated = computed(() => {
return Boolean(user.value)
})

export function useAuth() {
function login(payload: LoginPayload): boolean {
const email = payload.email.trim()
const password = payload.password.trim()

if (!email || !password) {
return false
}

user.value = {
name: 'Demo User',
email,
}

localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user.value))

return true
}

function register(payload: RegisterPayload): boolean {
const name = payload.name.trim()
const email = payload.email.trim()
const password = payload.password.trim()

if (!name || !email || !password) {
return false
}

user.value = {
name,
email,
}

localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user.value))

return true
}

function logout() {
user.value = null
localStorage.removeItem(AUTH_STORAGE_KEY)
}

return {
user,
isAuthenticated,
login,
register,
logout,
}
}