import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Initialize from localStorage if not done yet
  if (import.meta.client && !authStore.token) {
    authStore.init()
  }

  const publicRoutes = ['/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (!authStore.token && !isPublicRoute) {
    return navigateTo('/auth/login')
  }

  if (authStore.token && isPublicRoute) {
    return navigateTo('/dashboard')
  }
})
