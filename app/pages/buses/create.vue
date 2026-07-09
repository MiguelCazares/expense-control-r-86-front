<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { create } = useBuses()
const uiStore = useUiStore()
const router = useRouter()

const form = reactive({
  plate: '',
  number: '',
  model: '',
  brand: '',
  year: new Date().getFullYear(),
  route: '',
})
const loading = ref(false)
const error = ref('')
const errors = reactive<Record<string, string>>({})

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let valid = true
  if (!form.plate) { errors.plate = 'La placa es requerida'; valid = false }
  if (!form.number) { errors.number = 'El número es requerido'; valid = false }
  if (!form.model) { errors.model = 'El modelo es requerido'; valid = false }
  if (!form.brand) { errors.brand = 'La marca es requerida'; valid = false }
  if (!form.year) { errors.year = 'El año es requerido'; valid = false }
  if (!form.route) { errors.route = 'La ruta es requerida'; valid = false }
  return valid
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    await create({ ...form, year: Number(form.year) })
    uiStore.notify('Autobús creado correctamente', 'success')
    router.push('/buses')
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al crear el autobús')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton variant="ghost" size="sm" @click="router.push('/buses')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">Agregar nuevo autobús</h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Información del autobús">
        <form class="space-y-4" @submit.prevent="onSubmit">
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
            <AppButton variant="outline" type="button" :disabled="loading" @click="router.push('/buses')">
              Cancelar
            </AppButton>
            <AppButton variant="primary" type="submit" :loading="loading">
              Crear autobús
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
