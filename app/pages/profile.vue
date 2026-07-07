<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const uiStore = useUiStore()
const { $api } = useNuxtApp()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const fetching = ref(true)
const error = ref('')

const fetchProfile = async () => {
  fetching.value = true
  error.value = ''
  try {
    const res = await $api<any>('/owners/profile')
    const owner = res.data
    form.name = owner.name
    form.email = owner.email
    authStore.setOwner(owner)
  } catch (err: any) {
    error.value = err?.data?.message || 'Error al cargar el perfil'
  } finally {
    fetching.value = false
  }
}

const onSubmit = async () => {
  if (!form.name || !form.email) {
    error.value = 'El nombre y el correo electrónico son requeridos'
    return
  }
  if (form.password && form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const body: Record<string, string> = { name: form.name, email: form.email }
    if (form.password) body.password = form.password
    const res = await $api<any>('/owners/profile', { method: 'PATCH', body })
    authStore.setOwner(res.data)
    form.password = ''
    form.confirmPassword = ''
    uiStore.notify('Perfil actualizado correctamente', 'success')
  } catch (err: any) {
    error.value = err?.data?.message || 'Error al actualizar el perfil'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Mi perfil</h1>
      <p class="text-slate-500 mt-1">Administra la información de tu cuenta</p>
    </div>

    <div class="max-w-xl">
      <AppCard title="Detalles de la cuenta">
        <div v-if="fetching" class="flex justify-center py-8">
          <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <form v-else class="space-y-4" @submit.prevent="onSubmit">
          <AppAlert v-if="error" type="error" :message="error" @dismiss="error = ''" />

          <AppInput
            v-model="form.name"
            label="Nombre completo"
            placeholder="Tu nombre"
            :required="true"
            :disabled="loading"
          />
          <AppInput
            v-model="form.email"
            label="Correo electrónico"
            type="email"
            placeholder="tu@ejemplo.com"
            :required="true"
            :disabled="loading"
          />

          <div class="border-t border-slate-100 pt-4">
            <p class="text-sm font-medium text-slate-700 mb-3">Cambiar contraseña <span class="text-slate-400 font-normal">(dejar en blanco para mantener la actual)</span></p>
            <div class="space-y-4">
              <AppInput
                v-model="form.password"
                label="Nueva contraseña"
                type="password"
                placeholder="••••••••"
                :disabled="loading"
              />
              <AppInput
                v-model="form.confirmPassword"
                label="Confirmar nueva contraseña"
                type="password"
                placeholder="••••••••"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <AppButton type="submit" variant="primary" :loading="loading">
              Guardar cambios
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>
