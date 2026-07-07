import { defineStore } from 'pinia'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  timeout?: number
}

interface UiState {
  sidebarOpen: boolean
  notifications: Notification[]
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    sidebarOpen: true,
    notifications: [],
  }),

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    openSidebar() {
      this.sidebarOpen = true
    },

    closeSidebar() {
      this.sidebarOpen = false
    },

    addNotification(notification: Omit<Notification, 'id'>) {
      const id = Date.now().toString()
      this.notifications.push({ ...notification, id })

      const timeout = notification.timeout ?? 4000
      if (timeout > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, timeout)
      }

      return id
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },

    notify(message: string, type: Notification['type'] = 'info') {
      return this.addNotification({ message, type })
    },
  },
})
