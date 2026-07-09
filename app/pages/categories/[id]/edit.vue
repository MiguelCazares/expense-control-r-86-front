<script setup lang="ts">
import { useUiStore } from '~/stores/ui'
import { CATEGORY_COLORS, type CategoryColor } from '~/composables/useCategories'

definePageMeta({ middleware: 'auth' })

const { getOne, update } = useCategories()
const uiStore = useUiStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const form = reactive({
  name: '',
  color: 'default' as CategoryColor,
})
const slug = ref('')
const loading = ref(false)
const fetching = ref(true)
const error = ref('')
const errors = reactive<Record<string, string>>({})

const fetchCategory = async () => {
  fetching.value = true
  try {
    const category = await getOne(id)
    form.name = category.name ?? ''
    form.color = category.color ?? 'default'
    slug.value = category.slug ?? ''
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al cargar la categoría')
  } finally {
    fetching.value = false
  }
}

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
    await update(id, { name: form.name.trim(), color: form.color })
    uiStore.notify('Categoría actualizada correctamente', 'success')
    router.push('/categories')
  } catch (err: any) {
    error.value = getApiErrorMessage(err, 'Error al actualizar la categoría')
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategory)
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
      <h1 class="text-2xl font-bold text-slate-800">Editar categoría</h1>
    </div>

    <div class="max-w-2xl">
      <AppCard title="Información de la categoría">
        <div v-if="fetching" class="py-8 text-center text-slate-500">Cargando...</div>

        <form v-else class="space-y-4" @submit.prevent="onSubmit">
          <AppAlert v-if="error" type="error" :message="error" @dismiss="error = ''" />

          <AppInput
            v-model="form.name"
            label="Nombre"
            :required="true"
            :error="errors.name"
            :disabled="loading"
          />

          <p v-if="slug" class="text-xs text-slate-400 -mt-2">
            Identificador: <span class="font-mono">{{ slug }}</span>
          </p>

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
              Guardar cambios
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
