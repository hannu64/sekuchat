import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',  // Ensures assets load from root

  plugins: [
    react()
  ],

  server: {
    proxy: {
      '/api': {
        target: 'https://sekuchatback-production.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'wss://sekuchatback-production.up.railway.app',
        ws: true,
        changeOrigin: true
      }
    }
  },

  // Add this to force bundling of these deps (helps ESM resolution)
  optimizeDeps: {
    include: ['uuid', 'react-hot-toast', 'lucide-react']
  }
})
