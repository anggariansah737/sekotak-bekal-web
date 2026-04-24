import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the server handler from dist
const { default: handler } = await import('./dist/server/index.js');

const publicDir = join(__dirname, 'dist', 'client');
const port = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  try {
    // Try to handle with TanStack Start handler
    const response = await handler.fetch(new Request(
      `http://${req.headers.host}${req.url}`,
      {
        method: req.method,
        headers: new Headers(req.headers),
        body: ['POST', 'PUT', 'PATCH'].includes(req.method)
          ? req
          : undefined,
      }
    ));

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = await response.text();
    res.end(body);
  } catch (error) {
    console.error('Error handling request:', error);

    // Try to serve static files as fallback
    let filePath = join(publicDir, req.url === '/' ? 'index.html' : req.url);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath);
      res.statusCode = 200;
      res.end(content);
    } else {
      // Fallback to index.html for SPA routing
      const indexPath = join(publicDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(content);
      } else {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
