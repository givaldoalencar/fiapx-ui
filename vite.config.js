import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7263',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://localhost:7263',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    global: 'window', // Polyfill para 'global'
  },
});
