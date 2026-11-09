import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Veni-Delights-Website/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
