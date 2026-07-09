<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { getOne, update } = useDrivers()
const uiStore = useUiStore()

const id = route.params.id as string
const form = reactive({ name: '', lastName: '', license: '', phone: '' })
const loading = ref(false)
const fetching = ref(true)
const error = ref('')
const errors = reactive<Record<string, string>>({})

const fetchDriver = async () => {
  fetching.value = true
  try {
    const driver = await getOne(id)
    form.name = driver.name
    form.lastName = driver.lastName
    form.license = driver.license
    form.phone = driver.phone ?? ''
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar el conductor')
  } finally {
    fetching.value = false
  }
}

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let valid = true
  if (!form.name) { errors.name = 'Requerido'; valid = false }
  if (!form.lastName) { errors.lastName = 'Requerido'; valid = false }
  if (!form.license) { errors.license = 'Requerido'; valid = false }
  return valid
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    await update(id, {
      name: form.name,
      lastName: form.lastName,
      license: form.license,
      phone: form.phone || undefined,
    })
    uiStore.notify('Conductor actualizado correctamente', 'success')
    router.push(`/drivers/${id}`)
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al actualizar el conductor')
  } finally {
    loading.value = false
  }
}

onMounted(fetchDriver)
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton variant="ghost" size="sm" @click="router.push(`/drivers/${id}`)">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">Editar conductor</h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Información del conductor">
        <div v-if="fetching" class="flex justify-center py-8">
          <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <form v-else class="space-y-4" @submit.prevent="onSubmit">
          <AppAlert v-if="error" type="error" :message="error" @dismiss="error = ''" />

          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.name" label="Nombre" :required="true" :error="errors.name" :disabled="loading" />
            <AppInput v-model="form.lastName" label="Apellido" :required="true" :error="errors.lastName" :disabled="loading" />
          </div>

          <AppInput v-model="form.license" label="Número de licencia" :required="true" :error="errors.license" :disabled="loading" />
          <AppInput v-model="form.phone" label="Teléfono" type="tel" :disabled="loading" />

          <div class="flex gap-3 justify-end pt-2">
            <AppButton variant="outline" type="button" :disabled="loading" @click="router.push(`/drivers/${id}`)">
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
