/** PM2: ejecuta `vite preview` directamente con Node (evita wraps de npx/npm que rompen el upstream para Nginx). */
module.exports = {
  apps: [
    {
      name: "front-desaparecidos",
      cwd: __dirname,
      script: "./node_modules/vite/bin/vite.js",
      args: "preview --host 127.0.0.1 --port 4173 --strictPort",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      env: { NODE_ENV: "production" },
    },
  ],
};
