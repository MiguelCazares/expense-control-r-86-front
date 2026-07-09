<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { list, remove } = useDrivers()
const uiStore = useUiStore()
const router = useRouter()

const drivers = ref<any[]>([])
const meta = ref({ total: 0, currentPage: 1, totalPages: 1, perPage: 10 })
const loading = ref(true)
const error = ref('')
const search = ref('')
const page = ref(1)
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'lastName', label: 'Apellido' },
  { key: 'license', label: 'Licencia' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'actions', label: '', class: 'w-36' },
]

const fetchDrivers = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await list({ page: page.value, limit: 10, search: search.value || undefined })
    drivers.value = data.data ?? data
    if (data.meta) meta.value = data.meta
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar los conductores')
  } finally {
    loading.value = false
  }
}

const onSearch = useDebounceFn(() => {
  page.value = 1
  fetchDrivers()
}, 400)

watch(search, onSearch)
watch(page, fetchDrivers)

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await remove(deleteTarget.value.id)
    uiStore.notify('Conductor eliminado correctamente', 'success')
    deleteTarget.value = null
    fetchDrivers()
  } catch (err: any) {
    uiStore.notify(getApiErrorMessage(err, 'Error al eliminar el conductor'), 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(fetchDrivers)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Conductores</h1>
        <p class="text-slate-500 mt-1">Administra tu personal de conducción</p>
      </div>
      <AppButton variant="primary" @click="router.push('/drivers/create')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo conductor
      </AppButton>
    </div>

    <AppAlert v-if="error" type="error" :message="error" class="mb-4" @dismiss="error = ''" />

    <AppCard padding="none">
      <div class="p-4 border-b border-slate-100">
        <AppInput v-model="search" placeholder="Buscar conductores..." />
      </div>

      <div class="p-4">
        <AppTable :columns="columns" :rows="drivers" :loading="loading" empty-message="No se encontraron conductores.">
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton size="sm" variant="ghost" @click="router.push(`/drivers/${row.id}`)">Ver</AppButton>
              <AppButton size="sm" variant="outline" @click="router.push(`/drivers/${row.id}/edit`)">Editar</AppButton>
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
      title="Eliminar conductor"
      :message="`¿Estás seguro de que deseas eliminar a ${deleteTarget?.name} ${deleteTarget?.lastName}?`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
