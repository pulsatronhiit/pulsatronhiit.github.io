import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hiity/', // Pfad für GitHub Pages Unterordner
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist'
  }
})