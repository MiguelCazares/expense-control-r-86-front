<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { create } = useShifts()
const { list: listDrivers } = useDrivers()
const { list: listBuses } = useBuses()
const uiStore = useUiStore()
const router = useRouter()

const form = reactive({
  driverId: '',
  busId: '',
  date: '',
  startTime: '',
  notes: '',
})
const drivers = ref<any[]>([])
const buses = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const errors = reactive<Record<string, string>>({})

const driverOptions = computed(() =>
  drivers.value.map(d => ({ label: `${d.name} ${d.lastName}`, value: d.id }))
)
const busOptions = computed(() =>
  buses.value.map(b => ({ label: `${b.plate} - ${b.number}`, value: b.id }))
)

const fetchOptions = async () => {
  const [d, b] = await Promise.allSettled([
    listDrivers({ limit: 100 }),
    listBuses({ limit: 100 }),
  ])
  if (d.status === 'fulfilled') drivers.value = d.value?.data ?? d.value
  if (b.status === 'fulfilled') buses.value = b.value?.data ?? b.value
}

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let valid = true
  if (!form.driverId) { errors.driverId = 'El conductor es requerido'; valid = false }
  if (!form.busId) { errors.busId = 'El autobús es requerido'; valid = false }
  if (!form.date) { errors.date = 'La fecha es requerida'; valid = false }
  if (!form.startTime) { errors.startTime = 'La hora de inicio es requerida'; valid = false }
  return valid
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    await create({
      driverId: form.driverId,
      busId: form.busId,
      date: form.date,
      startTime: form.startTime,
      notes: form.notes || undefined,
    })
    uiStore.notify('Turno creado correctamente', 'success')
    router.push('/shifts')
  } catch (err: any) {
    error.value = err?.data?.message || 'Error al crear el turno'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOptions)
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
      <h1 class="text-2xl font-bold text-slate-800">Nuevo turno</h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Detalles del turno">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <AppAlert v-if="error" type="error" :message="error" @dismiss="error = ''" />

          <AppSelect
            v-model="form.driverId"
            label="Conductor"
            :options="driverOptions"
            placeholder="Seleccionar conductor"
            :required="true"
            :error="errors.driverId"
          />

          <AppSelect
            v-model="form.busId"
            label="Autobús"
            :options="busOptions"
            placeholder="Seleccionar autobús"
            :required="true"
            :error="errors.busId"
          />

          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.date" label="Fecha" type="date" :required="true" :error="errors.date" :disabled="loading" />
            <AppInput v-model="form.startTime" label="Hora de inicio" type="time" :required="true" :error="errors.startTime" :disabled="loading" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Notas</label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Notas opcionales..."
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <AppButton variant="outline" type="button" :disabled="loading" @click="router.push('/shifts')">
              Cancelar
            </AppButton>
            <AppButton variant="primary" type="submit" :loading="loading">
              Crear turno
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
