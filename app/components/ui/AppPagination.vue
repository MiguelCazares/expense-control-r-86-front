<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  total: number
  perPage: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const pages = computed(() => {
  const range: (number | '...')[] = []
  const total = props.totalPages

  if (total <= 7) {
    for (let i = 1; i <= total; i++) range.push(i)
  } else {
    range.push(1)
    if (props.currentPage > 3) range.push('...')
    const start = Math.max(2, props.currentPage - 1)
    const end = Math.min(total - 1, props.currentPage + 1)
    for (let i = start; i <= end; i++) range.push(i)
    if (props.currentPage < total - 2) range.push('...')
    range.push(total)
  }

  return range
})

const from = computed(() => (props.currentPage - 1) * props.perPage + 1)
const to = computed(() => Math.min(props.currentPage * props.perPage, props.total))
</script>

<template>
  <div v-if="totalPages > 0" class="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
    <p class="text-sm text-slate-500">
      Mostrando <span class="font-medium text-slate-700">{{ from }}–{{ to }}</span> de
      <span class="font-medium text-slate-700">{{ total }}</span> resultados
    </p>
    <div class="flex items-center gap-1">
      <button
        :disabled="currentPage === 1"
        class="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="emit('update:page', currentPage - 1)"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <template v-for="(page, i) in pages" :key="i">
        <span v-if="page === '...'" class="px-2 text-slate-400 text-sm">...</span>
        <button
          v-else
          :class="[
            'w-8 h-8 rounded-md text-sm font-medium transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100',
          ]"
          @click="emit('update:page', page as number)"
        >
          {{ page }}
        </button>
      </template>
      <button
        :disabled="currentPage === totalPages"
        class="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="emit('update:page', currentPage + 1)"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
