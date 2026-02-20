import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SekuChat',
        short_name: 'Seku',
        description: 'Secure private chat',
        theme_color: '#000000',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
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
  build: {
    rollupOptions: {
      external: ['uuid'],  // ← This is the key line
    },
  },
})
