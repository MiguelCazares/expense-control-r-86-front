// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],
  ssr: false,

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Route Control',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de gestión de rutas de autobuses' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1',
    },
  },

  devServer: {
    port: 3001,
  },

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-01-01',

  eslint: {
    config: {
      stylistic: true,
    },
  },

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },
})
