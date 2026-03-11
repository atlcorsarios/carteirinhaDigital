import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import { execSync } from 'child_process'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa';

let lastCommitDate = ''
try {
  lastCommitDate = execSync('git log -1 --format=%cI').toString().trim()
} catch (e) {
  lastCommitDate = new Date().toISOString()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({
      autoImport: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Corsários',
        short_name: 'PWA',
        description: 'Aplicação da atlética Corsários para gerenciamentos',
        start_url: '/',
        theme_color: '#212F55',
        background_color: '#1F2020',
        display: 'standalone',
        icons: [
          { src: '/icons/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ]
      }
    })
  ],
  define: {
    '__APP_BUILD_DATE__': JSON.stringify(lastCommitDate)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/',
})
