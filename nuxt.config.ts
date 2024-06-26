// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   devtools: {
      enabled: false
   },

   ssr: false,

   app: {
      head: {
         htmlAttrs: {
            lang: 'id'
         },
         meta: [
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { hid: "description", name: "description", content: "" },
            { name: "format-detection", content: "telephone=no" },
            { charset: "utf-8" },
         ],
         link: [
            { rel: 'preconnect', href: 'ttps://fonts.bunny.net' },
            { rel: 'stylesheet', href: 'https://fonts.bunny.net/css?family=lato:100,100i,300,300i,400,400i,700,700i,900,900i' }
         ]
      }
   },

   runtimeConfig: {
      public: {
         apiBaseUrl: '',
         appName: 'SIMBA School'
      }
   },

   imports: {
      dirs: [
         'composables',
         'composables/**',
         'utils',
         'utils/**'
      ]
   },

   modules: [
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
      '@nuxt/ui',
      'dayjs-nuxt'
   ],

   build: {
      transpile: [
         '@vuepic/vue-datepicker'
      ]
   },

   css: ['~/assets/css/base.css'],

   postcss: {
      plugins: {
         'postcss-import': {},
         'tailwindcss/nesting': {},
         tailwindcss: {},
         autoprefixer: {}
      }
   },

   ui: {
      global: true,
      safelistColors: [
         'primary',
         'blue',
         'gray',
         'red',
         'amber',
         'emerald',
         'cyan'
      ]
   },

   colorMode: {
      preference: 'light'
   },

   dayjs: {
      locales: ['id'],
      plugins: ['relativeTime', 'calendar', 'timezone', 'objectSupport'],
      defaultLocale: 'id',
      defaultTimezone: 'Asia/Jakarta'
   }
})
