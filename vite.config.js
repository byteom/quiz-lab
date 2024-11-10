import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteExternalsPlugin from 'vite-plugin-externals';

export default defineConfig({
  plugins: [
    react(),
    viteExternalsPlugin({
      'some-external-module': 'SomeGlobalVariable', // replace with actual module/global variable
    }),
  ],
});
