<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { getOne, getAssignments, addAssignment } = useDrivers()
const { list: listBuses } = useBuses()
const uiStore = useUiStore()

const id = route.params.id as string
const driver = ref<any>(null)
const assignments = ref<any[]>([])
const assignMeta = ref({ total: 0, currentPage: 1, totalPages: 1, perPage: 10 })
const buses = ref<any[]>([])
const loading = ref(true)
const assignLoading = ref(false)
const error = ref('')
const assignError = ref('')
const assignPage = ref(1)

const assignForm = reactive({ busId: '', date: '' })
const showAssignForm = ref(false)

const assignCols = [
  { key: 'bus', label: 'Autobús' },
  { key: 'date', label: 'Fecha' },
]

const fetchDriver = async () => {
  loading.value = true
  error.value = ''
  try {
    driver.value = await getOne(id)
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar el conductor')
  } finally {
    loading.value = false
  }
}

const fetchAssignments = async () => {
  try {
    const data = await getAssignments(id, { page: assignPage.value, limit: 10 })
    assignments.value = data.data ?? data
    if (data.meta) assignMeta.value = data.meta
  } catch {}
}

const fetchBuses = async () => {
  try {
    const data = await listBuses({ limit: 100 })
    buses.value = data.data ?? data
  } catch {}
}

const submitAssignment = async () => {
  if (!assignForm.busId || !assignForm.date) {
    assignError.value = 'El autobús y la fecha son requeridos'
    return
  }
  assignLoading.value = true
  assignError.value = ''
  try {
    await addAssignment(id, { busId: assignForm.busId, date: assignForm.date })
    uiStore.notify('Asignación agregada', 'success')
    assignForm.busId = ''
    assignForm.date = ''
    showAssignForm.value = false
    fetchAssignments()
  } catch (err: any) {
    assignError.value = getApiErrorMessage(err, 'Error al agregar la asignación')
  } finally {
    assignLoading.value = false
  }
}

watch(assignPage, fetchAssignments)

onMounted(async () => {
  await fetchDriver()
  await Promise.all([fetchAssignments(), fetchBuses()])
})

const busOptions = computed(() =>
  buses.value.map(b => ({ label: `${b.plate} - ${b.number}`, value: b.id }))
)
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton variant="ghost" size="sm" @click="router.push('/drivers')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">Detalles del conductor</h1>
    </div>

    <AppAlert v-if="error" type="error" :message="error" class="mb-4" />

    <div v-if="loading" class="flex justify-center py-16">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="driver" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Driver info -->
      <div class="lg:col-span-1">
        <AppCard>
          <template #header>
            <AppButton size="sm" variant="outline" @click="router.push(`/drivers/${id}/edit`)">Editar</AppButton>
          </template>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Nombre</span>
              <span class="font-semibold text-slate-800">{{ driver.name }} {{ driver.lastName }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Licencia</span>
              <span class="font-medium text-slate-700">{{ driver.license }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Teléfono</span>
              <span class="font-medium text-slate-700">{{ driver.phone || '—' }}</span>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Assignments -->
      <div class="lg:col-span-2 space-y-4">
        <AppCard title="Asignaciones de autobús">
          <template #header>
            <AppButton size="sm" variant="primary" @click="showAssignForm = !showAssignForm">
              {{ showAssignForm ? 'Cancelar' : '+ Agregar asignación' }}
            </AppButton>
          </template>

          <!-- Add assignment form -->
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="showAssignForm" class="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 class="text-sm font-medium text-slate-700 mb-3">Nueva asignación</h4>
              <AppAlert v-if="assignError" type="error" :message="assignError" class="mb-3" @dismiss="assignError = ''" />
              <div class="grid grid-cols-2 gap-3">
                <AppSelect
                  v-model="assignForm.busId"
                  label="Autobús"
                  :options="busOptions"
                  placeholder="Seleccionar autobús"
                  :required="true"
                />
                <AppInput
                  v-model="assignForm.date"
                  label="Fecha"
                  type="date"
                  :required="true"
                />
              </div>
              <div class="flex justify-end mt-3">
                <AppButton variant="primary" size="sm" :loading="assignLoading" @click="submitAssignment">
                  Agregar asignación
                </AppButton>
              </div>
            </div>
          </Transition>

          <AppTable
            :columns="assignCols"
            :rows="assignments"
            empty-message="No se encontraron asignaciones."
          >
            <template #cell-bus="{ row }">
              {{ row.bus?.plate ?? row.busId }}
            </template>
            <template #cell-date="{ row }">
              {{ formatDate(row.date) }}
            </template>
          </AppTable>

          <div v-if="assignMeta.totalPages > 1" class="mt-4">
            <AppPagination
              :current-page="assignMeta.currentPage"
              :total-pages="assignMeta.totalPages"
              :total="assignMeta.total"
              :per-page="assignMeta.perPage"
              @update:page="assignPage = $event"
            />
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>
