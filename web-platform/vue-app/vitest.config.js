import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      'composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
      'components': fileURLToPath(new URL('./src/components', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js']
  }
})
