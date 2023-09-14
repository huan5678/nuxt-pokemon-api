// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devtools: {enabled: true},
  modules: [
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/device',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-bootstrap-icons',
  ],
  bootstrapIcons: {
    renderType: 'inline',
  },
  ui: {
    global: true,
  },
});
