import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Prevents 'process is not defined' error in browser
    'process.env': {}
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/lucide-react/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Use IIFE format to wrap in closure and avoid jQuery conflicts
        format: 'iife',
        // Force the main JavaScript bundle to be named 'index.js'
        entryFileNames: 'assets/index.js',
        // Force chunks (if any) to not use hashes where possible
        chunkFileNames: 'assets/[name].js',
        // Force CSS and assets to use simple names (e.g., 'index.css')
        assetFileNames: 'assets/[name].[ext]',
        // Wrap all code - don't expose any globals
        inlineDynamicImports: true
      },
      // Ensure lucide-react is bundled
      external: [],
    }
  }
});