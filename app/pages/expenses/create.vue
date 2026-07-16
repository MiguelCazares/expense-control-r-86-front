<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { create } = useExpenses()
const { list: listBuses } = useBuses()
const { list: listShifts } = useShifts()
const { listActiveOptions } = useCategories()
const uiStore = useUiStore()
const router = useRouter()

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

const fetchOptions = async () => {
  const [b, s, c] = await Promise.allSettled([
    listBuses({ limit: 100 }),
    listShifts({ limit: 100 }),
    listActiveOptions(),
  ])
  if (b.status === 'fulfilled') buses.value = b.value?.data ?? b.value
  if (s.status === 'fulfilled') shifts.value = s.value?.data ?? s.value
  if (c.status === 'fulfilled') categoryOptions.value = c.value
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
    await create({
      busId: form.busId,
      shiftId: form.shiftId || undefined,
      date: form.date,
      amount: Number(form.amount),
      categoryId: form.categoryId,
      description: form.description || undefined,
    })
    uiStore.notify('Gasto registrado correctamente', 'success')
    router.push('/expenses')
  }
  catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al registrar el gasto')
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchOptions)
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
        Registrar gasto
      </h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Detalles del gasto">
        <form
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
              Registrar gasto
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
