import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'

import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import ForgotPasswordPage from '../pages/ForgotPasswordPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
            guestOnly: true,
        },
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterPage,
        meta: {
            guestOnly: true,
        },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordPage,
        meta: {
            guestOnly: true,
        },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        redirect: '/login',
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    const { token, user, fetchMe } = useAuth()

    if (to.meta.requiresAuth) {
        if (!token.value) {
            return {
                name: 'login',
            }
        }

        if (!user.value) {
            const currentUser = await fetchMe()

            if (!currentUser) {
                return {
                    name: 'login',
                }
            }
        }
    }

    if (to.meta.guestOnly && token.value) {
        return {
            name: 'dashboard',
        }
    }

    return true
})

export default router