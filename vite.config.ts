import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/railway-watch/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // 监听所有网络接口
    port: 5274, // 成铁demo固定5274端口
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5274,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
});
