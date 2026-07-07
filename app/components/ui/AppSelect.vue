<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  label?: string
  options: Option[]
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = `select-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full rounded-lg border px-3 py-2 text-sm text-slate-900',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
        'disabled:bg-slate-100 disabled:cursor-not-allowed',
        error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white',
      ]"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>
