import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/encr-api': {
        target: 'https://encr-decr.iserveu.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/encr-api/, ''),
        headers: {
          'User-Agent': 'PostmanRuntime/7.39.0'
        }
      },
      '/txn-api': {
        target: 'https://api-preprod.txninfra.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/txn-api/, ''),
        headers: {
          'User-Agent': 'PostmanRuntime/7.39.0'
        }
      }
    }
  }
})
