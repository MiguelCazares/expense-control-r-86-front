<script setup lang="ts">
interface Column {
  key: string
  label: string
  class?: string
}

interface Props {
  columns: Column[]
  rows: Record<string, any>[]
  loading?: boolean
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  emptyMessage: 'No se encontraron registros.',
})
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table class="min-w-full divide-y divide-slate-200">
      <thead class="bg-slate-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="['px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider', col.class]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-if="loading">
          <td
            :colspan="columns.length"
            class="px-4 py-12 text-center"
          >
            <div class="flex items-center justify-center gap-2 text-slate-400">
              <svg
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span class="text-sm">Cargando...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td
            :colspan="columns.length"
            class="px-4 py-12 text-center text-sm text-slate-400"
          >
            {{ emptyMessage }}
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="(row, index) in rows"
            :key="index"
            class="hover:bg-slate-50 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="['px-4 py-3 text-sm text-slate-700', col.class]"
            >
              <slot
                :name="`cell-${col.key}`"
                :row="row"
                :value="row[col.key]"
              >
                {{ row[col.key] ?? '—' }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
