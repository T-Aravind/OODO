import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (_err, _req, res) => {
            const httpRes = res as any
            if (httpRes && !httpRes.headersSent && typeof httpRes.writeHead === 'function') {
              httpRes.writeHead(503, {
                'Content-Type': 'application/json',
              })
              httpRes.end(
                JSON.stringify({
                  success: false,
                  message: 'Backend server offline. Utilizing client mock state.',
                })
              )
            }
          })
        },
      },
    },
  },
})
