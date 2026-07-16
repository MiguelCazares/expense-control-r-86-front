<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { list, remove, update } = useCategories()
const uiStore = useUiStore()
const router = useRouter()

const categories = ref<any[]>([])
const meta = ref({ total: 0, currentPage: 1, totalPages: 1, perPage: 10 })
const loading = ref(true)
const error = ref('')
const search = ref('')
const page = ref(1)
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'slug', label: 'Identificador' },
  { key: 'active', label: 'Estado' },
  { key: 'actions', label: '', class: 'w-48' },
]

const fetchCategories = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await list({ page: page.value, limit: 10, search: search.value || undefined })
    categories.value = data.data ?? data
    if (data.meta) meta.value = data.meta
  }
  catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar las categorías')
  }
  finally {
    loading.value = false
  }
}

const onSearch = useDebounceFn(() => {
  page.value = 1
  fetchCategories()
}, 400)

watch(search, onSearch)
watch(page, fetchCategories)

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await remove(deleteTarget.value.id)
    uiStore.notify('Categoría desactivada', 'success')
    deleteTarget.value = null
    fetchCategories()
  }
  catch (err: any) {
    uiStore.notify(getApiErrorMessage(err, 'Error al desactivar la categoría'), 'error')
  }
  finally {
    deleting.value = false
  }
}

const reactivate = async (row: any) => {
  try {
    await update(row.id, { active: true })
    uiStore.notify('Categoría reactivada', 'success')
    fetchCategories()
  }
  catch (err: any) {
    uiStore.notify(getApiErrorMessage(err, 'Error al reactivar la categoría'), 'error')
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          Categorías de gastos
        </h1>
        <p class="text-slate-500 mt-1">
          Clasifica los costos de tu operación
        </p>
      </div>
      <AppButton
        variant="primary"
        @click="router.push('/categories/create')"
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
        Nueva categoría
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
      <div class="p-4 border-b border-slate-100">
        <AppInput
          v-model="search"
          placeholder="Buscar por nombre..."
        />
      </div>

      <div class="p-4">
        <AppTable
          :columns="columns"
          :rows="categories"
          :loading="loading"
          empty-message="No se encontraron categorías."
        >
          <template #cell-name="{ row }">
            <AppBadge :variant="row.color">
              {{ row.name }}
            </AppBadge>
          </template>
          <template #cell-slug="{ row }">
            <span class="text-slate-500 text-xs font-mono">{{ row.slug }}</span>
          </template>
          <template #cell-active="{ row }">
            <AppBadge :variant="row.active ? 'success' : 'default'">
              {{ row.active ? 'Activa' : 'Inactiva' }}
            </AppBadge>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-2">
              <AppButton
                size="sm"
                variant="outline"
                @click="router.push(`/categories/${row.id}/edit`)"
              >
                Editar
              </AppButton>
              <AppButton
                v-if="row.active"
                size="sm"
                variant="danger"
                @click="deleteTarget = row"
              >
                Desactivar
              </AppButton>
              <AppButton
                v-else
                size="sm"
                variant="ghost"
                @click="reactivate(row)"
              >
                Reactivar
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
      title="Desactivar categoría"
      :message="`¿Deseas desactivar la categoría ${deleteTarget?.name}? Los gastos ya registrados la conservan, pero no podrás asignarla a gastos nuevos.`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
