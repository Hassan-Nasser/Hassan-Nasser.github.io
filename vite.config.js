import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

import fs from 'fs';
import path from 'path';

// Vite plugin to copy index.html to 404.html for GitHub Pages SPA routing
const copy404Plugin = () => {
  return {
    name: 'copy-404-plugin',
    writeBundle(options) {
      const outDir = options.dir || 'build';
      const indexPath = path.resolve(outDir, 'index.html');
      const errorPath = path.resolve(outDir, '404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, errorPath);
      }
    }
  };
};

export default defineConfig({
  base: '/',
  plugins: [react(), svgr(), copy404Plugin()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build'
  }
});
