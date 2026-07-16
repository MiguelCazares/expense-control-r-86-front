import { defineStore } from 'pinia'

interface Owner {
  id: string
  name: string
  email: string
  createdAt?: string
}

interface AuthState {
  token: string | null
  owner: Owner | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    owner: null,
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    ownerName: state => state.owner?.name ?? '',
    ownerEmail: state => state.owner?.email ?? '',
  },

  actions: {
    init() {
      if (import.meta.client) {
        const savedToken = localStorage.getItem('rc_token')
        const savedOwner = localStorage.getItem('rc_owner')
        if (savedToken) {
          this.token = savedToken
        }
        if (savedOwner) {
          try {
            this.owner = JSON.parse(savedOwner)
          }
          catch {
            this.owner = null
          }
        }
      }
    },

    setToken(token: string) {
      this.token = token
      if (import.meta.client) {
        localStorage.setItem('rc_token', token)
      }
    },

    setOwner(owner: Owner) {
      this.owner = owner
      if (import.meta.client) {
        localStorage.setItem('rc_owner', JSON.stringify(owner))
      }
    },

    logout() {
      this.token = null
      this.owner = null
      if (import.meta.client) {
        localStorage.removeItem('rc_token')
        localStorage.removeItem('rc_owner')
      }
    },
  },
})
