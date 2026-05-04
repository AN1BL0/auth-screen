import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
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
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardPage,
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

export default router