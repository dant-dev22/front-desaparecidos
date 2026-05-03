import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var apiBase = (_b = env.VITE_API_BASE_URL) !== null && _b !== void 0 ? _b : "https://urworldcup.com";
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
