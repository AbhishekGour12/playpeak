import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external access (0.0.0.0)
    allowedHosts: [
      'adduceable-charissa-communistic.ngrok-free.dev', // add your ngrok host here
    ],
    port: 5173, // or whatever port you use
     proxy: {
      '/api': 'http://localhost:5000', // forward API requests to backend
    },
  },
})
