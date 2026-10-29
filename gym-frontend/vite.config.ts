import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://back-tp-dsw-whzb.onrender.com',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'https://tp-dsw-front.vercel.app',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'https://tp-dsw-front.vercel.app');
          });
        },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
