<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})

const variantClasses = computed(() => {
  const map = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  return map[props.variant]
})

const sizeClasses = computed(() => {
  return props.size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
})
</script>

<template>
  <span :class="['inline-flex items-center font-medium rounded-full', variantClasses, sizeClasses]">
    <slot />
  </span>
</template>
