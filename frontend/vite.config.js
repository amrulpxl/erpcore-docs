import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react/') && !id.includes('react-')) {
              return 'react-core'
            }
            if (id.includes('react-dom')) {
              return 'react-dom'
            }
            if (id.includes('react-router')) {
              return 'router-vendor'
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor'
            }
            if (id.includes('react-hot-toast')) {
              return 'toast-vendor'
            }
            if (id.includes('react-markdown')) {
              return 'markdown-core'
            }
            if (id.includes('remark-') || id.includes('micromark') || id.includes('mdast-')) {
              return 'markdown-utils'
            }
            if (id.includes('@uiw/react-md-editor')) {
              return 'editor-vendor'
            }
            if (id.includes('axios')) {
              return 'http-vendor'
            }
            if (id.includes('tailwind') || id.includes('postcss')) {
              return 'css-vendor'
            }
            if (id.includes('scheduler')) {
              return 'react-scheduler'
            }

            return 'vendor-misc'
          }
          if (id.includes('/pages/Admin')) {
            return 'admin-pages'
          } 
          if (id.includes('/pages/')) {
            return 'public-pages'
          }
          if (id.includes('/components/')) {
            return 'components'
          }
        }
      }
    }
  }
})
