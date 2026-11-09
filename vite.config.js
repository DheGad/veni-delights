import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // Use root base for local dev/preview server so http://localhost:3000 works instantly.
  // Use repo path only for production build if specified.
  base: command === 'build' ? '/Veni-Delights-Website/' : '/',
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
    host: '0.0.0.0',
    port: 3000,
    open: false
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    open: false
  }
}));
