import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 5173,
    fs: {
      strict: false
    }
  },
  build: {
    outDir: 'dist'
  },
  // 👇👇👇 Add this
  preview: {
    port: 4173,
    strictPort: true
  },
  // 👇👇👇 Handle fallback for SPA routing
  optimizeDeps: {
    include: [],
  },
  // 👇👇👇 Catch-all fallback for SPA
  server: {
    historyApiFallback: true,
    host: true,
    port: 5173
  }
})
