import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '192.168.4.115',
    port: 8060,
    allowedHosts: ['tie-tkannat.it.tuni.fi'],
  },
  plugins: [react()],
})
