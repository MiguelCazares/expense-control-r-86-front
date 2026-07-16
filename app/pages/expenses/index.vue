<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { list, remove } = useExpenses()
const { list: listBuses } = useBuses()
const { listActiveOptions } = useCategories()
const uiStore = useUiStore()
const router = useRouter()

const expenses = ref<any[]>([])
const buses = ref<any[]>([])
const meta = ref({ total: 0, currentPage: 1, totalPages: 1, perPage: 10 })
const loading = ref(true)
const error = ref('')
const page = ref(1)
const busId = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const categoryFilter = ref('')
const categories = ref<{ label: string, value: string }[]>([])
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const busOptions = computed(() => [
  { label: 'Todos los autobuses', value: '' },
  ...buses.value.map(b => ({ label: `${b.plate} - ${b.number}`, value: String(b.id) })),
])

const columns = [
  { key: 'date', label: 'Fecha' },
  { key: 'bus', label: 'Autobús' },
  { key: 'category', label: 'Categoría' },
  { key: 'amount', label: 'Monto' },
  { key: 'description', label: 'Descripción' },
  { key: 'actions', label: '', class: 'w-36' },
]

const categoryOptions = computed(() => [
  { label: 'Todas las categorías', value: '' },
  ...categories.value,
])

const fetchExpenses = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await list({
      page: page.value,
      limit: 10,
      busId: busId.value || undefined,
      categoryId: categoryFilter.value || undefined,
      dateFrom: dateFrom.value || undefined,
      dateTo: dateTo.value || undefined,
    })
    expenses.value = data.data ?? data
    if (data.meta) meta.value = data.meta
  }
  catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar los gastos')
  }
  finally {
    loading.value = false
  }
}

watch([busId, dateFrom, dateTo, categoryFilter], () => {
  if (page.value !== 1) {
    page.value = 1
  }
  else {
    fetchExpenses()
  }
})
watch(page, fetchExpenses)

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await remove(deleteTarget.value.id)
    uiStore.notify('Gasto eliminado', 'success')
    deleteTarget.value = null
    fetchExpenses()
  }
  catch (err: any) {
    uiStore.notify(getApiErrorMessage(err, 'Error al eliminar el gasto'), 'error')
  }
  finally {
    deleting.value = false
  }
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

const fetchBuses = async () => {
  const b = await listBuses({ limit: 100 }).catch(() => null)
  if (b) buses.value = b?.data ?? b ?? []
}

const fetchCategories = async () => {
  categories.value = await listActiveOptions().catch(() => [])
}

onMounted(() => {
  fetchBuses()
  fetchCategories()
  fetchExpenses()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          Gastos
        </h1>
        <p class="text-slate-500 mt-1">
          Gestiona los costos operativos
        </p>
      </div>
      <AppButton
        variant="primary"
        @click="router.push('/expenses/create')"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Registrar gasto
      </AppButton>
    </div>

    <AppAlert
      v-if="error"
      type="error"
      :message="error"
      class="mb-4"
      @dismiss="error = ''"
    />

    <AppCard padding="none">
      <div class="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <AppSelect
          v-model="busId"
          :options="busOptions"
          placeholder="Todos los autobuses"
        />
        <AppSelect
          v-model="categoryFilter"
          :options="categoryOptions"
          placeholder="Todas las categorías"
        />
        <AppInput
          v-model="dateFrom"
          type="date"
          label="Desde"
        />
        <AppInput
          v-model="dateTo"
          type="date"
          label="Hasta"
        />
      </div>

      <div class="p-4">
        <AppTable
          :columns="columns"
          :rows="expenses"
          :loading="loading"
          empty-message="No se encontraron gastos."
        >
          <template #cell-date="{ row }">
            {{ formatDate(row.date) }}
          </template>
          <template #cell-bus="{ row }">
            {{ row.bus?.plate ?? '—' }}
          </template>
          <template #cell-category="{ row }">
            <AppBadge
              v-if="row.category"
              :variant="row.category.color"
            >
              {{ row.category.name }}
            </AppBadge>
            <span v-else>—</span>
          </template>
          <template #cell-amount="{ row }">
            <span class="text-red-600 font-semibold">{{ formatCurrency(row.amount) }}</span>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton
                size="sm"
                variant="outline"
                @click="router.push(`/expenses/${row.id}/edit`)"
              >
                Editar
              </AppButton>
              <AppButton
                size="sm"
                variant="danger"
                @click="deleteTarget = row"
              >
                Eliminar
              </AppButton>
            </div>
          </template>
        </AppTable>
      </div>

      <div
        v-if="!loading && meta.totalPages > 1"
        class="px-4 pb-4"
      >
        <AppPagination
          :current-page="meta.currentPage"
          :total-pages="meta.totalPages"
          :total="meta.total"
          :per-page="meta.perPage"
          @update:page="page = $event"
        />
      </div>
    </AppCard>

    <ConfirmDelete
      :open="!!deleteTarget"
      :loading="deleting"
      title="Eliminar gasto"
      message="¿Estás seguro de que deseas eliminar este gasto?"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
