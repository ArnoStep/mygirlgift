import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Относительная база, чтобы сборка работала и с file://, и на GitHub Pages
  base: './',
});
