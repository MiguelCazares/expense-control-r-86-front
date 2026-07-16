<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { getOne, update } = useExpenses()
const { list: listBuses } = useBuses()
const { list: listShifts } = useShifts()
const { listActiveOptions } = useCategories()
const uiStore = useUiStore()

const id = route.params.id as string
const form = reactive({
  busId: '',
  shiftId: '',
  date: '',
  amount: '',
  categoryId: '',
  description: '',
})
const buses = ref<any[]>([])
const shifts = ref<any[]>([])
const categoryOptions = ref<{ label: string, value: string }[]>([])
const loading = ref(false)
const fetching = ref(true)
const error = ref('')
const errors = reactive<Record<string, string>>({})

const busOptions = computed(() =>
  buses.value.map(b => ({ label: `${b.plate} - ${b.number}`, value: b.id })),
)
const shiftOptions = computed(() => [
  { label: 'Sin turno (independiente)', value: '' },
  ...shifts.value.map(s => ({
    label: `${formatDate(s.date, '')} - ${s.driver ? s.driver.name : s.driverId}`,
    value: s.id,
  })),
])

const fetchAll = async () => {
  fetching.value = true
  error.value = ''
  try {
    const [record, b, s, categories] = await Promise.all([
      getOne(id),
      listBuses({ limit: 100 }),
      listShifts({ limit: 100 }),
      listActiveOptions(),
    ])
    form.busId = record.busId ?? record.bus?.id ?? ''
    form.shiftId = record.shiftId ?? record.shift?.id ?? ''
    form.date = record.date ? record.date.slice(0, 10) : ''
    form.amount = String(record.amount ?? '')
    form.categoryId = String(record.categoryId ?? record.category?.id ?? '')
    form.description = record.description ?? ''
    buses.value = b?.data ?? b ?? []
    shifts.value = s?.data ?? s ?? []

    // A deactivated category stays selectable so saving keeps it unchanged.
    categoryOptions.value = categories.some((c: any) => c.value === form.categoryId)
      ? categories
      : [...categories, { label: `${record.category?.name} (inactiva)`, value: form.categoryId }]
  }
  catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar el registro de gasto')
  }
  finally {
    fetching.value = false
  }
}

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let valid = true
  if (!form.busId) { errors.busId = 'El autobús es requerido'; valid = false }
  if (!form.date) { errors.date = 'La fecha es requerida'; valid = false }
  if (!form.amount || Number(form.amount) <= 0) { errors.amount = 'Se requiere un monto válido'; valid = false }
  if (!form.categoryId) { errors.categoryId = 'La categoría es requerida'; valid = false }
  return valid
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    await update(id, {
      busId: form.busId,
      shiftId: form.shiftId || undefined,
      date: form.date,
      amount: Number(form.amount),
      categoryId: form.categoryId,
      description: form.description || undefined,
    })
    uiStore.notify('Gasto actualizado correctamente', 'success')
    router.push('/expenses')
  }
  catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al actualizar el gasto')
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchAll)
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton
        variant="ghost"
        size="sm"
        @click="router.push('/expenses')"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">
        Editar gasto
      </h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Detalles del gasto">
        <div
          v-if="fetching"
          class="flex justify-center py-8"
        >
          <svg
            class="animate-spin h-6 w-6 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>

        <form
          v-else
          class="space-y-4"
          @submit.prevent="onSubmit"
        >
          <AppAlert
            v-if="error"
            type="error"
            :message="error"
            @dismiss="error = ''"
          />

          <AppSelect
            v-model="form.busId"
            label="Autobús"
            :options="busOptions"
            placeholder="Seleccionar autobús"
            :required="true"
            :error="errors.busId"
          />

          <AppSelect
            v-model="form.shiftId"
            label="Turno (opcional)"
            :options="shiftOptions"
            placeholder="Asociar con un turno"
          />

          <AppSelect
            v-model="form.categoryId"
            label="Categoría"
            :options="categoryOptions"
            placeholder="Seleccionar categoría"
            :required="true"
            :error="errors.categoryId"
          />

          <div class="grid grid-cols-2 gap-4">
            <AppInput
              v-model="form.date"
              label="Fecha"
              type="date"
              :required="true"
              :error="errors.date"
              :disabled="loading"
            />
            <AppInput
              v-model="form.amount"
              label="Monto ($)"
              type="number"
              placeholder="0.00"
              :required="true"
              :error="errors.amount"
              :disabled="loading"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Descripción opcional..."
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <AppButton
              variant="outline"
              type="button"
              :disabled="loading"
              @click="router.push('/expenses')"
            >
              Cancelar
            </AppButton>
            <AppButton
              variant="primary"
              type="submit"
              :loading="loading"
            >
              Guardar cambios
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
