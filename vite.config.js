import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/hiity/' : '/', // Nur in Production den hiity Pfad verwenden
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist'
  }
})