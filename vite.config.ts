import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build';
  // Check if we're deploying to Vercel by checking environment or hostname
  const isVercel = !!process.env.VERCEL || 
                  (typeof window !== 'undefined' && 
                   window.location.hostname.includes('vercel.app'));
  
  // For production builds on Vercel, use root path
  const base = isVercel ? '/' : (isProduction ? '/breath-app/' : '/');
  
  console.log(`Vite config: isProduction=${isProduction}, isVercel=${isVercel}, base=${base}`);
  
  return {
    base,
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
      rollupOptions: {
        output: {
          manualChunks: undefined,
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      }
    }
  };
})
