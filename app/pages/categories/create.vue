<script setup lang="ts">
import { useUiStore } from '~/stores/ui'
import { CATEGORY_COLORS, type CategoryColor } from '~/composables/useCategories'

definePageMeta({ middleware: 'auth' })

const { create } = useCategories()
const uiStore = useUiStore()
const router = useRouter()

const form = reactive({
  name: '',
  color: 'default' as CategoryColor,
})
const loading = ref(false)
const error = ref('')
const errors = reactive<Record<string, string>>({})

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  let valid = true
  if (!form.name.trim()) { errors.name = 'El nombre es requerido'; valid = false }
  return valid
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    await create({ name: form.name.trim(), color: form.color })
    uiStore.notify('Categoría creada correctamente', 'success')
    router.push('/categories')
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al crear la categoría')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <AppButton variant="ghost" size="sm" @click="router.push('/categories')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </AppButton>
      <h1 class="text-2xl font-bold text-slate-800">Nueva categoría</h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Información de la categoría">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <AppAlert v-if="error" type="error" :message="error" @dismiss="error = ''" />

          <AppInput
            v-model="form.name"
            label="Nombre"
            placeholder="Peaje"
            :required="true"
            :error="errors.name"
            :disabled="loading"
          />

          <AppSelect
            v-model="form.color"
            label="Color"
            :options="CATEGORY_COLORS"
            placeholder="Seleccionar color"
            :disabled="loading"
          />

          <div class="flex items-center gap-2 text-sm text-slate-500">
            <span>Vista previa:</span>
            <AppBadge :variant="form.color">{{ form.name || 'Categoría' }}</AppBadge>
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <AppButton variant="outline" type="button" :disabled="loading" @click="router.push('/categories')">
              Cancelar
            </AppButton>
            <AppButton variant="primary" type="submit" :loading="loading">
              Crear categoría
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
