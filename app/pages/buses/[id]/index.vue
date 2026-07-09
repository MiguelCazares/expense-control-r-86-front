<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { getOne, getSummary } = useBuses()

const id = route.params.id as string
const bus = ref<any>(null)
const summary = ref<any>(null)
const loading = ref(true)
const summaryLoading = ref(false)
const error = ref('')

// Default to current month
const currentMonth = new Date().toISOString().slice(0, 7)
const selectedMonth = ref(currentMonth)

const fetchBus = async () => {
  loading.value = true
  error.value = ''
  try {
    bus.value = await getOne(id)
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar los detalles del autobús')
  } finally {
    loading.value = false
  }
}

const fetchSummary = async () => {
  summaryLoading.value = true
  try {
    summary.value = await getSummary(id, selectedMonth.value)
  } catch (err: any) {
    summary.value = null
  } finally {
    summaryLoading.value = false
  }
}

watch(selectedMonth, fetchSummary)
onMounted(async () => {
  await fetchBus()
  await fetchSummary()
})

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

const profit = computed(() => {
  if (!summary.value) return 0
  return (summary.value.totalIncome || 0) - (summary.value.totalExpenses || 0)
})
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton variant="ghost" size="sm" @click="router.push('/buses')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">Detalles del autobús</h1>
    </div>

    <AppAlert v-if="error" type="error" :message="error" class="mb-4" />

    <div v-if="loading" class="flex justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="bus" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Bus info -->
      <div class="lg:col-span-1">
        <AppCard>
          <template #header>
            <AppButton size="sm" variant="outline" @click="router.push(`/buses/${id}/edit`)">
              Editar
            </AppButton>
          </template>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Placa</span>
              <span class="font-semibold text-slate-800">{{ bus.plate }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Número</span>
              <span class="font-medium text-slate-700">{{ bus.number }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Marca</span>
              <span class="font-medium text-slate-700">{{ bus.brand }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Modelo</span>
              <span class="font-medium text-slate-700">{{ bus.model }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Año</span>
              <span class="font-medium text-slate-700">{{ bus.year }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Ruta</span>
              <span class="font-medium text-slate-700">{{ bus.route }}</span>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Monthly summary -->
      <div class="lg:col-span-2">
        <AppCard title="Resumen mensual">
          <template #header>
            <input
              v-model="selectedMonth"
              type="month"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </template>

          <div v-if="summaryLoading" class="flex justify-center py-8">
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>

          <div v-else-if="summary" class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-emerald-50 rounded-xl">
              <p class="text-xs font-medium text-emerald-600 uppercase tracking-wide">Ingresos</p>
              <p class="text-2xl font-bold text-emerald-700 mt-1">{{ formatCurrency(summary.totalIncome) }}</p>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-xl">
              <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Gastos</p>
              <p class="text-2xl font-bold text-red-700 mt-1">{{ formatCurrency(summary.totalExpenses) }}</p>
            </div>
            <div :class="['text-center p-4 rounded-xl', profit >= 0 ? 'bg-blue-50' : 'bg-orange-50']">
              <p :class="['text-xs font-medium uppercase tracking-wide', profit >= 0 ? 'text-blue-600' : 'text-orange-600']">Ganancia</p>
              <p :class="['text-2xl font-bold mt-1', profit >= 0 ? 'text-blue-700' : 'text-orange-700']">{{ formatCurrency(profit) }}</p>
            </div>
          </div>
          <div v-else class="text-center py-8 text-slate-400 text-sm">
            No hay datos de resumen disponibles para este mes.
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>
