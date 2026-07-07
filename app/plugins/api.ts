import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  if (import.meta.client) {
    authStore.init()
  }

  const $api = (url: string, opts: Record<string, any> = {}) => {
    const token = authStore.token

    return $fetch(url, {
      baseURL: config.public.apiBase,
      ...opts,
      headers: {
        ...(opts.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          authStore.logout()
          await navigateTo('/auth/login')
        }
      },
    })
  }

  return {
    provide: {
      api: $api,
    },
  }
})
