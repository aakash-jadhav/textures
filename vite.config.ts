import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow the Portless reverse proxy hostname (portless also injects --host).
    allowedHosts: ['.localhost'],
  },
})
