<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()

const dropdownOpen = ref(false)

const logout = () => {
  dropdownOpen.value = false
  authStore.logout()
}

// Close dropdown on outside click
const dropdownRef = ref<HTMLElement | null>(null)
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      dropdownOpen.value = false
    }
  })
})
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
    <!-- Left: hamburger + breadcrumb -->
    <div class="flex items-center gap-3">
      <button
        class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        @click="uiStore.toggleSidebar()"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <slot name="breadcrumb" />
    </div>

    <!-- Right: user menu -->
    <div ref="dropdownRef" class="relative">
      <button
        class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        @click="dropdownOpen = !dropdownOpen"
      >
        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          {{ authStore.ownerName.charAt(0).toUpperCase() }}
        </div>
        <div class="hidden sm:block text-left">
          <p class="text-sm font-medium text-slate-800 leading-none">{{ authStore.ownerName }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ authStore.ownerEmail }}</p>
        </div>
        <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Transition
        enter-active-class="transition-all duration-100"
        enter-from-class="opacity-0 scale-95 -translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-75"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-1"
      >
        <div
          v-if="dropdownOpen"
          class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50"
        >
          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            @click="dropdownOpen = false"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Perfil
          </NuxtLink>
          <hr class="my-1 border-slate-100" />
          <button
            class="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            @click="logout"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </Transition>
    </div>
  </header>
</template>
