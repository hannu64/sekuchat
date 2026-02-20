import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'   ← comment this out

export default defineConfig({
  base: '/',   // keep this

  plugins: [
    react(),
    // VitePWA({ ... })   ← comment the whole block or delete it
  ],

  server: {
    proxy: { /* your proxy config - keep it */ }
  },

  build: {
    rollupOptions: {
      external: ['uuid', 'react-hot-toast', 'lucide-react']
    }
  }
})
