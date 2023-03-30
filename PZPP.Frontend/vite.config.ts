import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../PZPP.Backend/wwwroot',
    emptyOutDir: true
  },
  resolve: {
    alias: {
        "devextreme/ui": 'devextreme/esm/ui'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  }
})
