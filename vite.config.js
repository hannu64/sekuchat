import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'  // add this if using alias

export default defineConfig({
  base: '/',

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

  resolve: {
    alias: {
      // Try this corrected path for uuid (v10+ browser ESM entry is usually 'uuid/dist/esm-browser/index.js' but confirm below)
      'uuid': path.resolve(__dirname, 'node_modules/uuid/dist/esm-browser/index.js')
    }
  }
})
