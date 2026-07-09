<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { list, remove } = useBuses()
const uiStore = useUiStore()
const router = useRouter()

const buses = ref<any[]>([])
const meta = ref({ total: 0, currentPage: 1, totalPages: 1, perPage: 10 })
const loading = ref(true)
const error = ref('')
const search = ref('')
const page = ref(1)
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const columns = [
  { key: 'plate', label: 'Placa' },
  { key: 'number', label: 'Número' },
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Año' },
  { key: 'route', label: 'Ruta' },
  { key: 'actions', label: '', class: 'w-32' },
]

const fetchBuses = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await list({ page: page.value, limit: 10, search: search.value || undefined })
    buses.value = data.data ?? data
    if (data.meta) meta.value = data.meta
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar los autobuses')
  } finally {
    loading.value = false
  }
}

const onSearch = useDebounceFn(() => {
  page.value = 1
  fetchBuses()
}, 400)

watch(search, onSearch)
watch(page, fetchBuses)

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await remove(deleteTarget.value.id)
    uiStore.notify('Autobús eliminado correctamente', 'success')
    deleteTarget.value = null
    fetchBuses()
  } catch (err: any) {
    uiStore.notify(getApiErrorMessage(err, 'Error al eliminar el autobús'), 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(fetchBuses)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Autobuses</h1>
        <p class="text-slate-500 mt-1">Administra tu flota</p>
      </div>
      <AppButton variant="primary" @click="router.push('/buses/create')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo autobús
      </AppButton>
    </div>

    <AppAlert v-if="error" type="error" :message="error" class="mb-4" @dismiss="error = ''" />

    <AppCard padding="none">
      <div class="p-4 border-b border-slate-100">
        <AppInput
          v-model="search"
          placeholder="Buscar por placa, número, marca..."
        />
      </div>

      <div class="p-4">
        <AppTable :columns="columns" :rows="buses" :loading="loading" empty-message="No se encontraron autobuses. ¡Agrega el primero!">
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton size="sm" variant="ghost" @click="router.push(`/buses/${row.id}`)">
                Ver
              </AppButton>
              <AppButton size="sm" variant="outline" @click="router.push(`/buses/${row.id}/edit`)">
                Editar
              </AppButton>
              <AppButton size="sm" variant="danger" @click="deleteTarget = row">
                Eliminar
              </AppButton>
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
      title="Eliminar autobús"
      :message="`¿Estás seguro de que deseas eliminar el autobús ${deleteTarget?.plate}? Esta acción no se puede deshacer.`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
