<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

const uiStore = useUiStore()
const route = useRoute()

const navItems = [
  {
    label: 'Panel principal',
    to: '/dashboard',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />`,
  },
  {
    label: 'Autobuses',
    to: '/buses',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />`,
  },
  {
    label: 'Conductores',
    to: '/drivers',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />`,
  },
  {
    label: 'Turnos',
    to: '/shifts',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />`,
  },
  {
    label: 'Ingresos',
    to: '/income',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
  },
  {
    label: 'Gastos',
    to: '/expenses',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />`,
  },
  {
    label: 'Categorías',
    to: '/categories',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />`,
  },
  {
    label: 'Flujo de caja',
    to: '/cash-flow',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`,
  },
  {
    label: 'Perfil',
    to: '/profile',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`,
  },
]

const isActive = (to: string) => {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}
</script>

<template>
  <!-- Mobile overlay -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="uiStore.sidebarOpen"
      class="fixed inset-0 z-20 bg-black/40 lg:hidden"
      @click="uiStore.closeSidebar()"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition
    enter-active-class="transition-transform duration-200"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <aside
      v-show="uiStore.sidebarOpen"
      class="fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-[#1e293b] lg:static lg:z-auto"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 h-16 px-5 border-b border-slate-700">
        <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <span class="text-white font-bold text-lg tracking-tight">RouteControl</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="['sidebar-link', { active: isActive(item.to) }]"
          @click="uiStore.closeSidebar()"
        >
          <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="item.icon" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Bottom version -->
      <div class="px-5 py-3 border-t border-slate-700">
        <p class="text-xs text-slate-500">Route Control v1.0</p>
      </div>
    </aside>
  </Transition>
</template>
