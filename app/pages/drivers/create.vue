<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const { create } = useDrivers()
const uiStore = useUiStore()
const router = useRouter()

const form = reactive({ name: '', lastName: '', license: '', phone: '' })
const loading = ref(false)
const error = ref('')
const errors = reactive<Record<string, string>>({})

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
    await create({
      name: form.name,
      lastName: form.lastName,
      license: form.license,
      phone: form.phone || undefined,
    })
    uiStore.notify('Conductor creado correctamente', 'success')
    router.push('/drivers')
  }
  catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al crear el conductor')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton
        variant="ghost"
        size="sm"
        @click="router.push('/drivers')"
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
        Agregar nuevo conductor
      </h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Información del conductor">
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

          <div class="grid grid-cols-2 gap-4">
            <AppInput
              v-model="form.name"
              label="Nombre"
              placeholder="Juan"
              :required="true"
              :error="errors.name"
              :disabled="loading"
            />
            <AppInput
              v-model="form.lastName"
              label="Apellido"
              placeholder="García"
              :required="true"
              :error="errors.lastName"
              :disabled="loading"
            />
          </div>

          <AppInput
            v-model="form.license"
            label="Número de licencia"
            placeholder="DL-123456"
            :required="true"
            :error="errors.license"
            :disabled="loading"
          />
          <AppInput
            v-model="form.phone"
            label="Teléfono"
            type="tel"
            placeholder="+1 555 000 0000"
            :disabled="loading"
          />

          <div class="flex gap-3 justify-end pt-2">
            <AppButton
              variant="outline"
              type="button"
              :disabled="loading"
              @click="router.push('/drivers')"
            >
              Cancelar
            </AppButton>
            <AppButton
              variant="primary"
              type="submit"
              :loading="loading"
            >
              Crear conductor
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
