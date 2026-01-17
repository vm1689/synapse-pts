import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin for debug file operations
function debugFilePlugin() {
  return {
    name: 'debug-file-plugin',
    configureServer(server) {
      const debugDir = path.resolve('src/debug');

      // Save debug file
      server.middlewares.use('/api/save-debug', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, content } = JSON.parse(body);
              if (!fs.existsSync(debugDir)) {
                fs.mkdirSync(debugDir, { recursive: true });
              }
              const filePath = path.join(debugDir, filename);
              fs.writeFileSync(filePath, content);
              console.log(`[Debug] Saved: ${filename}`);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, path: filePath }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end('Method not allowed');
        }
      });

      // Read debug file
      server.middlewares.use('/api/read-debug', (req, res) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url, 'http://localhost');
            const filename = url.searchParams.get('filename');
            if (!filename) {
              res.writeHead(400);
              res.end('Missing filename');
              return;
            }
            const filePath = path.join(debugDir, filename);
            if (!fs.existsSync(filePath)) {
              res.writeHead(404);
              res.end('File not found');
              return;
            }
            const content = fs.readFileSync(filePath, 'utf-8');
            console.log(`[Debug] Read: ${filename}`);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(content);
          } catch (err) {
            res.writeHead(500);
            res.end(err.message);
          }
        } else {
          res.writeHead(405);
          res.end('Method not allowed');
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), debugFilePlugin()],
})
