import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Veni-Delights-Website/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        products: resolve(__dirname, 'products.html'),
        butterCakes: resolve(__dirname, 'butter-cakes.html'),
        brownies: resolve(__dirname, 'brownies.html'),
        pandanLayer: resolve(__dirname, 'pandan-layer.html'),
        pavlova: resolve(__dirname, 'pavlova.html'),
        fruitTarts: resolve(__dirname, 'fruit-tarts.html'),
        eggTarts: resolve(__dirname, 'egg-tarts.html'),
        cheeseTarts: resolve(__dirname, 'cheese-tarts.html'),
        traditionalIndian: resolve(__dirname, 'traditional-indian.html'),
        traditionalKuih: resolve(__dirname, 'traditional-kuih.html'),
        dessertCorner: resolve(__dirname, 'dessert-corner.html'),
        customise: resolve(__dirname, 'customise.html'),
        concierge: resolve(__dirname, 'concierge.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        faq: resolve(__dirname, 'faq.html'),
        contact: resolve(__dirname, 'contact.html'),
        order: resolve(__dirname, 'order.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor';
          }
          if (id.includes('node_modules/swiper')) {
            return 'swiper-vendor';
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    open: false
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    open: false
  }
}));
