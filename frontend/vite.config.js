import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      usePolling: false,
    },
    hmr: {
      overlay: false, // ปิดการรีหน้าเมื่อมี error
    },
  },
});
