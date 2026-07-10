<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  step?: string | number
  min?: string | number
  error?: string
  disabled?: boolean
  required?: boolean
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = `input-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :step="step"
      :min="min"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
        'disabled:bg-slate-100 disabled:cursor-not-allowed',
        error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white',
      ]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
