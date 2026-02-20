import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',  // Critical for asset paths on root domain

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

  // Optional: pre-bundle problematic deps for consistency
  optimizeDeps: {
//    include: ['uuid', 'react-hot-toast', 'lucide-react']
  }
})
