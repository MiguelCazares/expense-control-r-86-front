<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

const uiStore = useUiStore()

// Open sidebar by default on large screens
onMounted(() => {
  if (window.innerWidth >= 1024) {
    uiStore.openSidebar()
  } else {
    uiStore.closeSidebar()
  }
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">
    <TheSidebar />

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <TheHeader />

      <main class="flex-1 overflow-y-auto">
        <div class="p-4 sm:p-6 max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <!-- Notification stack -->
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      <Transition
        v-for="notification in uiStore.notifications"
        :key="notification.id"
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <AppAlert
          :message="notification.message"
          :type="notification.type"
          @dismiss="uiStore.removeNotification(notification.id)"
        />
      </Transition>
    </div>
  </div>
</template>
