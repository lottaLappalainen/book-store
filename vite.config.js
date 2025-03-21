import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '192.168.4.115',
    port: process.env.FRONTEND_PORT,
    allowedHosts: ['tie-tkannat.it.tuni.fi'],
  },
  plugins: [react()],
})
