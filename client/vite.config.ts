import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://[::1]:4005',
        changeOrigin: true
      }
    },
    hmr: true
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true
  }
});
