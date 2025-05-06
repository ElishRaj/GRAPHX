export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://graphx-yky3.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/auth": {
        target: "https://graphx-yky3.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
