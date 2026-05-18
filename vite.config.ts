// cSpell: words duckhunt
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import postCssNested from 'postcss-nested';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  base: './',
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
    outDir: '../dist',
    assetsDir: '',
    sourcemap: true,
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        app: './duckhunt.html',
      },
      output: {
        assetFileNames: 'duckhunt[extname]',
        chunkFileNames: 'duckhunt.js',
        entryFileNames: 'duckhunt.js',
      },
    },
  },
  server: {
    open: 'duckhunt.html',
    cors: true,
  },
});
