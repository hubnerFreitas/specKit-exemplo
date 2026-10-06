import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    reportCompressedSize: true,
    // A entrada SSR é passada pela CLI (`vite build --ssr src/entry-prerender.tsx`).
    // Aqui só garantimos que o build SSR não apague o dist/ do cliente, que já
    // contém os assets com hash.
    ...(isSsrBuild ? { emptyOutDir: true } : {}),
  },
}));
