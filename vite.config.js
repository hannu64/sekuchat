import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'  // Node built-in for alias

export default defineConfig({
  base: '/',  // Ensure root asset loading

  plugins: [
    react()
    // No VitePWA here - completely removed
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
      // Force bundling of these ESM packages (fixes Vercel resolution)
      'uuid': path.resolve(__dirname, 'node_modules/uuid/dist/esm-browser/index.js'),
      'react-hot-toast': path.resolve(__dirname, 'node_modules/react-hot-toast/dist/index.esm.js'),
      'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react/dist/esm/index.js')
    }
  }
})
