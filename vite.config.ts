import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import postCssNested from 'postcss-nested';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  plugins: [
    checker({
      typescript: true,
      stylelint: {
        lintCommand: 'stylelint src/**/*.css',
      },
      eslint: {
        lintCommand: 'eslint "./src/*.{ts,tsx}"',
      },
      overlay: {
        initialIsOpen: false,
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postCssNested(),
      ],
    },
  },
  build: {
    outDir: '../docs/',
    assetsDir: '',
    sourcemap: true,
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rolldownOptions: {
      output: {
        assetFileNames: 'duckhunt[extname]',
        chunkFileNames: 'duckhunt.js',
        entryFileNames: 'duckhunt.js',
      },
    },
  },
  server: {
    open: 'index.html',
    cors: true,
  },
});
