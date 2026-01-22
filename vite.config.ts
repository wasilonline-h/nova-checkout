import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Prevents 'process is not defined' error in browser
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Force the main JavaScript bundle to be named 'index.js'
        entryFileNames: 'assets/index.js',
        // Force chunks (if any) to not use hashes where possible
        chunkFileNames: 'assets/[name].js',
        // Force CSS and assets to use simple names (e.g., 'index.css')
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});