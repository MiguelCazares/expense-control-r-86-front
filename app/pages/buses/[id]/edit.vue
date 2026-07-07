<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { getOne, update } = useBuses()
const uiStore = useUiStore()

const id = route.params.id as string
const form = reactive({
  plate: '',
  number: '',
  model: '',
  brand: '',
  year: new Date().getFullYear(),
  route: '',
})
const loading = ref(false)
const fetching = ref(true)
const error = ref('')
const errors = reactive<Record<string, string>>({})

const fetchBus = async () => {
  fetching.value = true
  try {
    const bus = await getOne(id)
    form.plate = bus.plate
    form.number = bus.number
    form.model = bus.model
    form.brand = bus.brand
    form.year = bus.year
    form.route = bus.route
  } catch (err: any) {
    error.value = err?.data?.message || 'Error al cargar el autobús'
  } finally {
    fetching.value = false
  }
}

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let valid = true
  if (!form.plate) { errors.plate = 'Requerido'; valid = false }
  if (!form.number) { errors.number = 'Requerido'; valid = false }
  if (!form.model) { errors.model = 'Requerido'; valid = false }
  if (!form.brand) { errors.brand = 'Requerido'; valid = false }
  if (!form.year) { errors.year = 'Requerido'; valid = false }
  if (!form.route) { errors.route = 'Requerido'; valid = false }
  return valid
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    await update(id, { ...form, year: Number(form.year) })
    uiStore.notify('Autobús actualizado correctamente', 'success')
    router.push(`/buses/${id}`)
  } catch (err: any) {
    error.value = err?.data?.message || 'Error al actualizar el autobús'
  } finally {
    loading.value = false
  }
}

onMounted(fetchBus)
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton variant="ghost" size="sm" @click="router.push(`/buses/${id}`)">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">Editar autobús</h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Información del autobús">
        <div v-if="fetching" class="flex justify-center py-8">
          <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <form v-else class="space-y-4" @submit.prevent="onSubmit">
          <AppAlert v-if="error" type="error" :message="error" @dismiss="error = ''" />

          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.plate" label="Placa" placeholder="ABC-123" :required="true" :error="errors.plate" :disabled="loading" />
            <AppInput v-model="form.number" label="Número" placeholder="001" :required="true" :error="errors.number" :disabled="loading" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.brand" label="Marca" placeholder="Mercedes-Benz" :required="true" :error="errors.brand" :disabled="loading" />
            <AppInput v-model="form.model" label="Modelo" placeholder="Sprinter" :required="true" :error="errors.model" :disabled="loading" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.year" label="Año" type="number" placeholder="2024" :required="true" :error="errors.year" :disabled="loading" />
            <AppInput v-model="form.route" label="Ruta" placeholder="Centro - Aeropuerto" :required="true" :error="errors.route" :disabled="loading" />
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <AppButton variant="outline" type="button" :disabled="loading" @click="router.push(`/buses/${id}`)">
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
