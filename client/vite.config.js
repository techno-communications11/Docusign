import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["writeup.techno-communications.com", "localhost", "192.168.0.25"],
    proxy: {
      "/api": {
        target: "http://localhost:4509/auth",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
