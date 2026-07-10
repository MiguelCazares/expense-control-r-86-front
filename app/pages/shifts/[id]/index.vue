<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { getOne, getSummary } = useShifts()

const id = route.params.id as string
const shift = ref<any>(null)
const summary = ref<any>(null)
const incomeList = computed(() => shift.value?.income ?? [])
const expenseList = computed(() => shift.value?.expenses ?? [])
const loading = ref(true)
const error = ref('')

const incomeCols = [
  { key: 'date', label: 'Fecha' },
  { key: 'amount', label: 'Monto' },
  { key: 'notes', label: 'Notas' },
]

const expenseCols = [
  { key: 'date', label: 'Fecha' },
  { key: 'category', label: 'Categoría' },
  { key: 'amount', label: 'Monto' },
  { key: 'description', label: 'Descripción' },
]

const fetchAll = async () => {
  loading.value = true
  error.value = ''
  try {
    const [shiftRes, summaryRes] = await Promise.allSettled([
      getOne(id),
      getSummary(id),
    ])
    if (shiftRes.status === 'fulfilled') shift.value = shiftRes.value
    if (summaryRes.status === 'fulfilled') summary.value = summaryRes.value
    if (shiftRes.status === 'rejected') throw shiftRes.reason
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar los detalles del turno')
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

const statusVariant = (status: string) => {
  if (status === 'OPEN' || status === 'open') return 'success'
  return 'default'
}

const profit = computed(() => {
  if (!summary.value) return 0
  return (summary.value.totalIncome || 0) - (summary.value.totalExpenses || 0)
})
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton variant="ghost" size="sm" @click="router.push('/shifts')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">Detalles del turno</h1>
    </div>

    <AppAlert v-if="error" type="error" :message="error" class="mb-4" />

    <div v-if="loading" class="flex justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="shift" class="space-y-6">
      <!-- Info row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AppCard>
          <template #header>
            <AppButton size="sm" variant="outline" @click="router.push(`/shifts/${id}/edit`)">Editar</AppButton>
          </template>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Fecha</span>
              <span class="font-medium">{{ shift.date ? new Date(shift.date).toLocaleDateString() : '—' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Conductor</span>
              <span class="font-medium">{{ shift.driver ? `${shift.driver.name} ${shift.driver.lastName}` : '—' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Autobús</span>
              <span class="font-medium">{{ shift.bus?.plate ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Inicio</span>
              <span class="font-medium">{{ shift.startTime ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Fin</span>
              <span class="font-medium">{{ shift.endTime ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Vueltas</span>
              <span class="font-medium">{{ shift.laps ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-sm items-center">
              <span class="text-slate-500">Estado</span>
              <AppBadge :variant="statusVariant(shift.status)">{{ shift.status }}</AppBadge>
            </div>
            <div v-if="shift.notes" class="text-sm">
              <span class="text-slate-500">Notas</span>
              <p class="mt-1 text-slate-700">{{ shift.notes }}</p>
            </div>
          </div>
        </AppCard>

        <!-- Financial summary -->
        <div v-if="summary" class="lg:col-span-2">
          <AppCard title="Resumen financiero">
            <div class="grid grid-cols-3 gap-4">
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
          </AppCard>
        </div>
      </div>

      <!-- Income table -->
      <AppCard title="Registros de ingresos">
        <template #header>
          <AppButton size="sm" variant="primary" @click="router.push('/income/create')">+ Agregar ingreso</AppButton>
        </template>
        <AppTable :columns="incomeCols" :rows="incomeList" empty-message="No hay ingresos para este turno.">
          <template #cell-date="{ row }">
            {{ row.date ? new Date(row.date).toLocaleDateString() : '—' }}
          </template>
          <template #cell-amount="{ row }">
            <span class="text-emerald-700 font-medium">{{ formatCurrency(row.amount) }}</span>
          </template>
        </AppTable>
      </AppCard>

      <!-- Expenses table -->
      <AppCard title="Registros de gastos">
        <template #header>
          <AppButton size="sm" variant="primary" @click="router.push('/expenses/create')">+ Agregar gasto</AppButton>
        </template>
        <AppTable :columns="expenseCols" :rows="expenseList" empty-message="No hay gastos para este turno.">
          <template #cell-date="{ row }">
            {{ row.date ? new Date(row.date).toLocaleDateString() : '—' }}
          </template>
          <template #cell-amount="{ row }">
            <span class="text-red-600 font-medium">{{ formatCurrency(row.amount) }}</span>
          </template>
          <template #cell-category="{ row }">
            <AppBadge v-if="row.category" :variant="row.category.color">{{ row.category.name }}</AppBadge>
            <span v-else>—</span>
          </template>
        </AppTable>
      </AppCard>
    </div>
  </div>
</template>
