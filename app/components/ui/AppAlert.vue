<script setup lang="ts">
interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: true,
})

const emit = defineEmits<{ dismiss: [] }>()

const dismissed = ref(false)

const config = computed(() => {
  const map = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      icon: 'text-emerald-500',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: 'text-red-500',
      iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-500',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-500',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  }
  return map[props.type]
})
</script>

<template>
  <div
    v-if="!dismissed"
    :class="['flex items-start gap-3 px-4 py-3 rounded-lg border', config.bg]"
  >
    <svg
      :class="['h-5 w-5 shrink-0 mt-0.5', config.icon]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        :d="config.iconPath"
      />
    </svg>
    <p :class="['text-sm flex-1', config.text]">
      {{ message }}
    </p>
    <button
      v-if="dismissible"
      :class="['shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity', config.icon]"
      @click="dismissed = true; emit('dismiss')"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>
