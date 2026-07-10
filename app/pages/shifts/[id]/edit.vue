<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { getOne, update } = useShifts()
const uiStore = useUiStore()

const id = route.params.id as string
const form = reactive({ endTime: '', notes: '', laps: '' as string | number })
const loading = ref(false)
const fetching = ref(true)
const error = ref('')

const fetchShift = async () => {
  fetching.value = true
  try {
    const shift = await getOne(id)
    form.endTime = shift.endTime ?? ''
    form.notes = shift.notes ?? ''
    form.laps = shift.laps ?? ''
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar el turno')
  } finally {
    fetching.value = false
  }
}

const onSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    await update(id, {
      endTime: form.endTime || undefined,
      notes: form.notes || undefined,
      laps: form.laps === '' ? undefined : Number(form.laps),
    })
    uiStore.notify('Turno actualizado correctamente', 'success')
    router.push(`/shifts/${id}`)
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al actualizar el turno')
  } finally {
    loading.value = false
  }
}

onMounted(fetchShift)
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton variant="ghost" size="sm" @click="router.push(`/shifts/${id}`)">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">Editar turno</h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Actualizar turno">
        <div v-if="fetching" class="flex justify-center py-8">
          <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <form v-else class="space-y-4" @submit.prevent="onSubmit">
          <AppAlert v-if="error" type="error" :message="error" @dismiss="error = ''" />

          <AppInput v-model="form.endTime" label="Hora de fin" type="time" :disabled="loading" />
          <p class="text-xs text-slate-500 -mt-2">El turno se cierra automáticamente al establecer la hora de fin.</p>

          <AppInput
            v-model="form.laps"
            label="Vueltas"
            type="number"
            step="0.5"
            min="0"
            placeholder="Ej. 12.5"
            :disabled="loading"
          />
          <p class="text-xs text-slate-500 -mt-2">Número de vueltas completadas, en incrementos de 0.5.</p>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700">Notas</label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Notas opcionales..."
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <AppButton variant="outline" type="button" :disabled="loading" @click="router.push(`/shifts/${id}`)">
              Cancelar
            </AppButton>
            <AppButton variant="primary" type="submit" :loading="loading">
              Guardar cambios
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
