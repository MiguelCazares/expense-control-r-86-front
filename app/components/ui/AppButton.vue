<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

const variantClasses = computed(() => {
  const map = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border-transparent',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500 border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400 border-transparent',
    outline: 'bg-white text-slate-700 hover:bg-slate-50 focus:ring-blue-500 border-slate-300',
  }
  return map[props.variant]
})

const sizeClasses = computed(() => {
  const map = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return map[props.size]
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg border',
      'focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-150',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      variantClasses,
      sizeClasses,
    ]"
  >
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </button>
</template>
