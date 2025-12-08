import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",

    // Allow the frontend domain you are using
    allowedHosts: ["writeup.techno-communications.com"],

    hmr: {
      host: "192.168.0.25", // the IP you're accessing from (local dev)
      protocol: "ws",
      port: 5173,
    },

    proxy: {
      "/login": {
        target: "https://writeupapi.techno-communications.com/auth",
        changeOrigin: true,
      },
      "/users": {
        target: "https://writeupapi.techno-communications.com/auth",
        changeOrigin: true,
      },
      "/register": {
        target: "https://writeupapi.techno-communications.com/auth",
        changeOrigin: true,
      },
      "/reset-password": {
        target: "https://writeupapi.techno-communications.com/auth",
        changeOrigin: true,
      },
      "/logout": {
        target: "https://writeupapi.techno-communications.com/auth",
        changeOrigin: true,
      },
    },
  },
});
