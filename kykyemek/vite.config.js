import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/university': {
        target: 'https://sks.klu.edu.tr/Takvimler/73-yemek-takvimi.klu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/university/, '/Takvimler/73-yemek-takvimi.klu'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/database']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
