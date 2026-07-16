import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@stylistic/max-statements-per-line': ['error', { max: 3 }],
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-empty': 'warn',
  },
})
