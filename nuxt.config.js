// nuxt.config.js
export default {
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api',
    },
  },

  css: ['@/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2025-04-25',
};