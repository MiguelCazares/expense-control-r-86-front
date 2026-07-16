<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
})

const paddingClasses = computed(() => {
  const map = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  return map[props.padding]
})
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div
      v-if="title || $slots.header"
      class="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
    >
      <div>
        <h3 class="text-base font-semibold text-slate-800">
          {{ title }}
        </h3>
        <p
          v-if="subtitle"
          class="text-sm text-slate-500 mt-0.5"
        >
          {{ subtitle }}
        </p>
      </div>
      <slot name="header" />
    </div>
    <div :class="paddingClasses">
      <slot />
    </div>
  </div>
</template>
