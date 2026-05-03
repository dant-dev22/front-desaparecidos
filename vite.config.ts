import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = env.VITE_API_BASE_URL ?? "https://urworldcup.com";

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/api": {
          target: apiBase,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
      allowedHosts: ["urworldcup.com", "www.urworldcup.com"],
    },
  };
});
