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
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@formkit/auto-animate/nuxt',
    'nuxt-bootstrap-icons',
  ],
  bootstrapIcons: {
    renderType: 'inline',
  },
});
