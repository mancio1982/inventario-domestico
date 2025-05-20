// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puoi cambiare la porta di default del frontend se vuoi
    proxy: {
      // Stringa di scelta rapida: tutte le richieste a /api vengono reindirizzate
      '/api': {
        target: 'http://localhost:3001', // L'URL del tuo server backend
        changeOrigin: true, // Necessario per i virtual host
        // Non è necessario riscrivere il path se VITE_API_BASE_URL è già /api
        // Se VITE_API_BASE_URL fosse 'http://localhost:3001' e tu chiamassi '/api/...' dal frontend
        // allora avresti bisogno di: rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
