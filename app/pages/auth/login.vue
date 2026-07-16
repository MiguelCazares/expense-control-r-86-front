<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'auth', middleware: 'auth' })

const authStore = useAuthStore()
const { $api } = useNuxtApp()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const validate = () => {
  if (!form.email) return 'El correo electrónico es requerido'
  if (!form.password) return 'La contraseña es requerida'
  return null
}

const onSubmit = async () => {
  error.value = ''
  const validationError = validate()
  if (validationError) {
    error.value = validationError
    return
  }

  loading.value = true
  try {
    const res = await $api<any>('/auth/login', {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })
    authStore.setToken(res.data.accessToken)
    if (res.data.owner) authStore.setOwner(res.data.owner)
    await navigateTo('/dashboard')
  }
  catch (err: any) {
    error.value = getApiErrorMessage(err, 'Credenciales inválidas. Inténtalo de nuevo.')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-8">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800">
        Bienvenido
      </h2>
      <p class="text-slate-500 text-sm mt-1">
        Inicia sesión para continuar
      </p>
    </div>

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

      <AppInput
        v-model="form.email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@ejemplo.com"
        :required="true"
        :disabled="loading"
      />

      <AppInput
        v-model="form.password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        :required="true"
        :disabled="loading"
      />

      <AppButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        class="w-full mt-2"
      >
        Iniciar sesión
      </AppButton>
    </form>

    <p class="text-center text-sm text-slate-500 mt-6">
      ¿No tienes cuenta?
      <NuxtLink
        to="/auth/register"
        class="text-blue-600 font-medium hover:underline"
      >
        Créala
      </NuxtLink>
    </p>
  </div>
</template>
