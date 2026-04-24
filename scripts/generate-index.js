import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, '../dist/client');
const assetsDir = path.join(clientDir, 'assets');

// Find the main index JS file
const files = fs.readdirSync(assetsDir);
const indexFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));

if (!indexFile) {
  console.error('Could not find index-*.js file');
  process.exit(1);
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sekotak Bekal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${indexFile}"><\/script>
  </body>
</html>
`;

fs.writeFileSync(path.join(clientDir, 'index.html'), html);
console.log(`Generated index.html with entry point: ${indexFile}`);
