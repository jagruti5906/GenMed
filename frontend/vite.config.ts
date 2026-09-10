import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Serve files uploaded to public/assets/aistudio/ during local development
function aistudioMediaPlugin(): Plugin {
  return {
    name: 'vite-plugin-aistudio-media',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/assets/aistudio/')) {
          const rawPath = req.url.split('?')[0].split('#')[0];
          try {
            const decodedPath = decodeURIComponent(rawPath);
            const relativePath = decodedPath.replace(/^\//, '');
            const aistudioDir = path.resolve(__dirname, 'public', 'assets', 'aistudio');
            const filePath = path.resolve(__dirname, 'public', relativePath);
            if (
              filePath.startsWith(aistudioDir + path.sep) &&
              fs.existsSync(filePath) &&
              fs.statSync(filePath).isFile()
            ) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeMap: Record<string, string> = {
                '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                '.png': 'image/png',  '.gif': 'image/gif',
                '.webp': 'image/webp', '.svg': 'image/svg+xml',
                '.bmp': 'image/bmp',  '.ico': 'image/x-icon',
                '.mp4': 'video/mp4',  '.webm': 'video/webm',
                '.ogv': 'video/ogg',  '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',  '.ogg': 'audio/ogg',
                '.pdf': 'application/pdf',
              };
              res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
              res.setHeader('Cache-Control', 'no-cache');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch {
            // Fall through on URI decode or file-access failure
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  const backendUrl = process.env.VITE_API_TARGET || 'http://localhost:5000';

  return {
    plugins: [react(), tailwindcss(), aistudioMediaPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
