<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  message?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Eliminar registro',
  message: '¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.',
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <AppModal
    :open="open"
    title=""
    size="sm"
    @close="emit('cancel')"
  >
    <div class="flex flex-col items-center gap-4 text-center">
      <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          class="h-7 w-7 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-slate-800">
          {{ title }}
        </h3>
        <p class="mt-1 text-sm text-slate-500">
          {{ message }}
        </p>
      </div>
      <div class="flex gap-3 w-full">
        <AppButton
          variant="outline"
          class="flex-1"
          :disabled="loading"
          @click="emit('cancel')"
        >
          Cancelar
        </AppButton>
        <AppButton
          variant="danger"
          class="flex-1"
          :loading="loading"
          @click="emit('confirm')"
        >
          Eliminar
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>
