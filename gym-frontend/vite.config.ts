import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de tu archivo .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          // Toma la URL que esté activa en tu .env (o localhost:3000 por defecto)
          target: env.VITE_BACKEND_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          headers: {
            Origin: 'https://tp-dsw-front.vercel.app',
          },
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});
