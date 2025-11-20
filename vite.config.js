import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/app/' : '/', // GitHub Pages base path
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist/app' // Build app into dist/app folder
  },
  // Ensure service worker is available during development
  publicDir: 'public'
})