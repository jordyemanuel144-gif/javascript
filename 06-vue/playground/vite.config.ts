import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // El alias @ apunta a src/. Es lo que verás en casi todos los proyectos.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
