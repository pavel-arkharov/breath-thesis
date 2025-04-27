import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // Configure Vite to handle assets properly including audio files
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg'],
  // Ensure build doesn't fail on importing assets
  build: {
    assetsInlineLimit: 0, // Never inline assets, always keep them as separate files
  }
})
