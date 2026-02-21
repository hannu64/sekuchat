import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
      // Correct browser ESM entry for uuid (v10+)
      'uuid': path.resolve(__dirname, 'node_modules/uuid/dist/esm-browser/index.js'),
      // If still issues with others, add:
      'react-hot-toast': path.resolve(__dirname, 'node_modules/react-hot-toast/dist/index.esm.js'),
      'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react/dist/esm/index.js')
    }
  }
})
