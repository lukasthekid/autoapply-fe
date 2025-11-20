import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            return 'vendor'
          }
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify CSS
    cssMinify: true,
    // Source maps for production (set to false for smaller builds)
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: 'es2015',
  },
  server: {
    proxy: {
      // Proxy API requests to local backend during development
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.log('⚠️ Proxy error - Make sure your local backend is running on http://127.0.0.1:8000', err)
          })
        },
      },
    },
  },
})

