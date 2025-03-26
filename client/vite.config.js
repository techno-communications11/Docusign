import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://writeupapi.techno-communications.com/auth',
        //  target: 'http://localhost:4509/auth',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    allowedHosts: ['writeup.techno-communications.com', 'localhost']
  }
});
