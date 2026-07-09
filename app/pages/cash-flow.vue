<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { getSummary } = useCashFlow()
const { list: listBuses } = useBuses()

const buses = ref<any[]>([])
const busId = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const cashFlow = ref<any>(null)
const loading = ref(true)
const error = ref('')

const busOptions = computed(() => [
  { label: 'Todos los autobuses', value: '' },
  ...buses.value.map(b => ({ label: `${b.plate} - ${b.number}`, value: String(b.id) })),
])

const dailyColumns = [
  { key: 'date', label: 'Fecha' },
  { key: 'income', label: 'Ingresos' },
  { key: 'expenses', label: 'Gastos' },
  { key: 'balance', label: 'Balance' },
]

const categoryLabels: Record<string, string> = {
  fuel: 'Combustible',
  maintenance: 'Mantenimiento',
  repair: 'Reparación',
  other: 'Otro',
}

const categoryVariant = (cat: string) => {
  const map: Record<string, any> = {
    fuel: 'amber',
    maintenance: 'info',
    repair: 'danger',
    other: 'default',
  }
  return map[cat] ?? 'default'
}

const pad = (n: number) => String(n).padStart(2, '0')
const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const mondayOf = (d: Date) => {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  return monday
}

const setToday = () => {
  const today = toISODate(new Date())
  dateFrom.value = today
  dateTo.value = today
}

const setThisWeek = () => {
  const monday = mondayOf(new Date())
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  dateFrom.value = toISODate(monday)
  dateTo.value = toISODate(sunday)
}

const setLastWeek = () => {
  const thisMonday = mondayOf(new Date())
  const lastMonday = new Date(thisMonday)
  lastMonday.setDate(thisMonday.getDate() - 7)
  const lastSunday = new Date(lastMonday)
  lastSunday.setDate(lastMonday.getDate() + 6)
  dateFrom.value = toISODate(lastMonday)
  dateTo.value = toISODate(lastSunday)
}

const setThisMonth = () => {
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  dateFrom.value = toISODate(first)
  dateTo.value = toISODate(last)
}

const shortcuts = [
  { label: 'Hoy', action: setToday },
  { label: 'Esta semana', action: setThisWeek },
  { label: 'Semana pasada', action: setLastWeek },
  { label: 'Este mes', action: setThisMonth },
]

const fetchCashFlow = async () => {
  if (!dateFrom.value || !dateTo.value) return
  loading.value = true
  error.value = ''
  try {
    cashFlow.value = await getSummary({
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      busId: busId.value || undefined,
    })
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar el flujo de caja')
    cashFlow.value = null
  } finally {
    loading.value = false
  }
}

const fetchBuses = async () => {
  const b = await listBuses({ limit: 100 }).catch(() => null)
  if (b) buses.value = b?.data ?? b ?? []
}

watch([dateFrom, dateTo, busId], fetchCashFlow)

onMounted(() => {
  fetchBuses()
  setThisWeek()
})

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

const formatDate = (val: string) => (val ? new Date(`${val}T00:00:00`).toLocaleDateString() : '—')

const balanceColor = (val: number) => (val >= 0 ? 'text-blue-700' : 'text-orange-700')
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Flujo de caja</h1>
      <p class="text-slate-500 mt-1">Ingresos y gastos del negocio por período</p>
    </div>

    <AppAlert v-if="error" type="error" :message="error" class="mb-4" @dismiss="error = ''" />

    <AppCard padding="none" class="mb-6">
      <div class="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <AppSelect v-model="busId" label="Autobús" :options="busOptions" placeholder="Todos los autobuses" />
        <AppInput v-model="dateFrom" type="date" label="Desde" />
        <AppInput v-model="dateTo" type="date" label="Hasta" />
        <div class="flex gap-2 flex-wrap">
          <AppButton
            v-for="shortcut in shortcuts"
            :key="shortcut.label"
            size="sm"
            variant="outline"
            type="button"
            @click="shortcut.action"
          >
            {{ shortcut.label }}
          </AppButton>
        </div>
      </div>
    </AppCard>

    <div v-if="loading" class="flex justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <template v-else-if="cashFlow">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="text-center p-4 bg-emerald-50 rounded-xl">
          <p class="text-xs font-medium text-emerald-600 uppercase tracking-wide">Ingresos</p>
          <p class="text-2xl font-bold text-emerald-700 mt-1">{{ formatCurrency(cashFlow.totalIncome) }}</p>
          <p class="text-xs text-emerald-600 mt-1">{{ cashFlow.incomeCount }} registro(s)</p>
        </div>
        <div class="text-center p-4 bg-red-50 rounded-xl">
          <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Gastos</p>
          <p class="text-2xl font-bold text-red-700 mt-1">{{ formatCurrency(cashFlow.totalExpenses) }}</p>
          <p class="text-xs text-red-600 mt-1">{{ cashFlow.expenseCount }} registro(s)</p>
        </div>
        <div :class="['text-center p-4 rounded-xl', cashFlow.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50']">
          <p :class="['text-xs font-medium uppercase tracking-wide', cashFlow.balance >= 0 ? 'text-blue-600' : 'text-orange-600']">Balance</p>
          <p :class="['text-2xl font-bold mt-1', balanceColor(cashFlow.balance)]">{{ formatCurrency(cashFlow.balance) }}</p>
        </div>
      </div>

      <AppCard title="Gastos por categoría" class="mb-6" v-if="cashFlow.expensesByCategory?.length">
        <div class="flex flex-wrap gap-3">
          <div
            v-for="cat in cashFlow.expensesByCategory"
            :key="cat.category"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200"
          >
            <AppBadge :variant="categoryVariant(cat.category)">{{ categoryLabels[cat.category] ?? cat.category }}</AppBadge>
            <span class="text-sm font-semibold text-slate-700">{{ formatCurrency(cat.amount) }}</span>
            <span class="text-xs text-slate-400">({{ cat.count }})</span>
          </div>
        </div>
      </AppCard>

      <AppCard title="Detalle diario" padding="none">
        <div class="p-4">
          <AppTable :columns="dailyColumns" :rows="cashFlow.daily" empty-message="Sin movimientos en este rango.">
            <template #cell-date="{ row }">
              {{ formatDate(row.date) }}
            </template>
            <template #cell-income="{ row }">
              <span class="text-emerald-600 font-medium">{{ formatCurrency(row.income) }}</span>
            </template>
            <template #cell-expenses="{ row }">
              <span class="text-red-600 font-medium">{{ formatCurrency(row.expenses) }}</span>
            </template>
            <template #cell-balance="{ row }">
              <span :class="['font-semibold', balanceColor(row.balance)]">{{ formatCurrency(row.balance) }}</span>
            </template>
          </AppTable>
        </div>
      </AppCard>
    </template>
  </div>
</template>
