<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const { $api } = useNuxtApp()

const loading = ref(true)
const error = ref('')

const stats = reactive({
  totalBuses: 0,
  totalDrivers: 0,
  openShifts: 0,
  totalIncome: 0,
})

const fetchStats = async () => {
  loading.value = true
  error.value = ''
  try {
    const [busesRes, driversRes, shiftsRes, incomeRes] = await Promise.allSettled([
      $api<any>('/buses', { params: { limit: 1 } }),
      $api<any>('/drivers', { params: { limit: 1 } }),
      $api<any>('/shifts', { params: { limit: 100 } }),
      $api<any>('/income', { params: { limit: 1 } }),
    ])

    if (busesRes.status === 'fulfilled') {
      stats.totalBuses = busesRes.value?.data?.meta?.total ?? busesRes.value?.data?.length ?? 0
    }
    if (driversRes.status === 'fulfilled') {
      stats.totalDrivers = driversRes.value?.data?.meta?.total ?? driversRes.value?.data?.length ?? 0
    }
    if (shiftsRes.status === 'fulfilled') {
      const shiftsData = shiftsRes.value?.data?.data ?? shiftsRes.value?.data ?? []
      stats.openShifts = Array.isArray(shiftsData)
        ? shiftsData.filter((s: any) => s.status === 'OPEN' || s.status === 'open').length
        : 0
    }
    if (incomeRes.status === 'fulfilled') {
      stats.totalIncome = incomeRes.value?.data?.meta?.total ?? 0
    }
  } catch (err: any) {
    error.value = err?.data?.message || 'Error al cargar los datos del panel'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Panel principal</h1>
      <p class="text-slate-500 mt-1">¡Bienvenido, {{ authStore.ownerName }}!</p>
    </div>

    <AppAlert v-if="error" type="error" :message="error" class="mb-6" />

    <!-- Stats grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total de autobuses"
        :value="loading ? '—' : stats.totalBuses"
        subtitle="Registrados en la flota"
        color="blue"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </template>
      </StatCard>

      <StatCard
        title="Total de conductores"
        :value="loading ? '—' : stats.totalDrivers"
        subtitle="Personal activo"
        color="emerald"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </template>
      </StatCard>

      <StatCard
        title="Turnos abiertos"
        :value="loading ? '—' : stats.openShifts"
        subtitle="Actualmente activos"
        color="amber"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatCard>

      <StatCard
        title="Registros de ingresos"
        :value="loading ? '—' : stats.totalIncome"
        subtitle="Total de transacciones"
        color="purple"
      >
        <template #icon>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Quick actions -->
    <AppCard title="Acciones rápidas" subtitle="Navega a las tareas más comunes">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <NuxtLink
          v-for="link in [
            { to: '/buses/create', label: 'Agregar autobús', color: 'blue' },
            { to: '/drivers/create', label: 'Agregar conductor', color: 'emerald' },
            { to: '/shifts/create', label: 'Nuevo turno', color: 'amber' },
            { to: '/income/create', label: 'Registrar ingreso', color: 'green' },
            { to: '/expenses/create', label: 'Registrar gasto', color: 'red' },
            { to: '/profile', label: 'Mi perfil', color: 'slate' },
          ]"
          :key="link.to"
          :to="link.to"
          class="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-center"
        >
          <span class="text-sm font-medium text-slate-700 group-hover:text-blue-700">{{ link.label }}</span>
        </NuxtLink>
      </div>
    </AppCard>
  </div>
</template>
