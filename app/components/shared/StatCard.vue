<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  subtitle?: string
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'red' | 'slate'
  icon?: 'bus' | 'users' | 'clock' | 'dollar' | 'receipt' | 'chart'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
})

const colorConfig = computed(() => {
  const map = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', text: 'text-red-600' },
    slate: { bg: 'bg-slate-50', icon: 'bg-slate-100 text-slate-600', text: 'text-slate-600' },
  }
  return map[props.color]
})
</script>

<template>
  <div :class="['rounded-xl border border-slate-200 bg-white p-6 shadow-sm']">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-slate-500">{{ title }}</p>
        <p class="mt-1 text-3xl font-bold text-slate-800">{{ value }}</p>
        <p v-if="subtitle" class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
      </div>
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', colorConfig.icon]">
        <slot name="icon">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </slot>
      </div>
    </div>
  </div>
</template>
