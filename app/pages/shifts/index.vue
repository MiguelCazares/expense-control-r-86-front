<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { list, remove } = useShifts()
const uiStore = useUiStore()
const router = useRouter()

const shifts = ref<any[]>([])
const meta = ref({ total: 0, currentPage: 1, totalPages: 1, perPage: 10 })
const loading = ref(true)
const error = ref('')
const search = ref('')
const page = ref(1)
const dateFrom = ref('')
const dateTo = ref('')
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const columns = [
  { key: 'date', label: 'Fecha' },
  { key: 'driver', label: 'Conductor' },
  { key: 'bus', label: 'Autobús' },
  { key: 'startTime', label: 'Inicio' },
  { key: 'endTime', label: 'Fin' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: '', class: 'w-36' },
]

const fetchShifts = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await list({
      page: page.value,
      limit: 10,
      search: search.value || undefined,
      dateFrom: dateFrom.value || undefined,
      dateTo: dateTo.value || undefined,
    })
    shifts.value = data.data ?? data
    if (data.meta) meta.value = data.meta
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar los turnos')
  } finally {
    loading.value = false
  }
}

const onSearch = useDebounceFn(() => {
  page.value = 1
  fetchShifts()
}, 400)

watch(search, onSearch)
watch([dateFrom, dateTo], () => {
  if (page.value !== 1) {
    page.value = 1
  } else {
    fetchShifts()
  }
})
watch(page, fetchShifts)

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await remove(deleteTarget.value.id)
    uiStore.notify('Turno eliminado', 'success')
    deleteTarget.value = null
    fetchShifts()
  } catch (err: any) {
    uiStore.notify(getApiErrorMessage(err, 'Error al eliminar el turno'), 'error')
  } finally {
    deleting.value = false
  }
}

const statusVariant = (status: string) => {
  if (status === 'OPEN' || status === 'open') return 'success'
  if (status === 'CLOSED' || status === 'closed') return 'default'
  return 'info'
}

onMounted(fetchShifts)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Turnos</h1>
        <p class="text-slate-500 mt-1">Seguimiento de sesiones de turno</p>
      </div>
      <AppButton variant="primary" @click="router.push('/shifts/create')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo turno
      </AppButton>
    </div>

    <AppAlert v-if="error" type="error" :message="error" class="mb-4" @dismiss="error = ''" />

    <AppCard padding="none">
      <div class="p-4 border-b border-slate-100 flex flex-wrap gap-3">
        <div class="flex-1 min-w-48">
          <AppInput v-model="search" placeholder="Buscar turnos..." />
        </div>
        <AppInput v-model="dateFrom" label="" type="date" placeholder="Desde" hint="" />
        <AppInput v-model="dateTo" label="" type="date" placeholder="Hasta" hint="" />
      </div>

      <div class="p-4">
        <AppTable :columns="columns" :rows="shifts" :loading="loading" empty-message="No se encontraron turnos.">
          <template #cell-date="{ row }">
            {{ formatDate(row.date) }}
          </template>
          <template #cell-driver="{ row }">
            {{ row.driver ? `${row.driver.name} ${row.driver.lastName}` : '—' }}
          </template>
          <template #cell-bus="{ row }">
            {{ row.bus?.plate ?? '—' }}
          </template>
          <template #cell-status="{ row }">
            <AppBadge :variant="statusVariant(row.status)">{{ row.status }}</AppBadge>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton size="sm" variant="ghost" @click="router.push(`/shifts/${row.id}`)">Ver</AppButton>
              <AppButton size="sm" variant="outline" @click="router.push(`/shifts/${row.id}/edit`)">Editar</AppButton>
              <AppButton size="sm" variant="danger" @click="deleteTarget = row">Eliminar</AppButton>
            </div>
          </template>
        </AppTable>
      </div>

      <div v-if="!loading && meta.totalPages > 1" class="px-4 pb-4">
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
      title="Eliminar turno"
      message="¿Estás seguro de que deseas eliminar este turno?"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
