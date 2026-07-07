<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{ close: [] }>()

const sizeClasses = computed(() => {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }
  return map[props.size]
})

const onBackdrop = () => emit('close')

onMounted(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.open) emit('close')
  }
  document.addEventListener('keydown', handleKey)
  onUnmounted(() => document.removeEventListener('keydown', handleKey))
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="onBackdrop"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            :class="['w-full bg-white rounded-2xl shadow-2xl overflow-hidden', sizeClasses]"
          >
            <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 class="text-lg font-semibold text-slate-800">{{ title }}</h3>
              <button
                class="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                @click="emit('close')"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6">
              <slot />
            </div>
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-100 bg-slate-50">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
