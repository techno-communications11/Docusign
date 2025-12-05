import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
     hmr: {
      host: "192.168.0.25",  // use the IP you are visiting from
      protocol: "ws",
      port: 5173
    },
    proxy: {
      "/login": {
        target: "http://localhost:4503/auth",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:4503/auth",
        changeOrigin: true,
      },
      "/register": {
        target: "http://localhost:4503/auth",
        changeOrigin: true,
      },
      "/reset-password": {
        target: "http://localhost:4503/auth",
        changeOrigin: true,
      },
      "/logout": {
        target: "http://localhost:4503/auth",
        changeOrigin: true,
      },
    },
  },
});
