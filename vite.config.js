import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No VitePWA import or plugin

export default defineConfig({
  base: '/',  // keep

  plugins: [
    react()   // only this
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

  /*
  build: {
    rollupOptions: {
      external: ['uuid', 'react-hot-toast', 'lucide-react']
    }
  }
*/

})
