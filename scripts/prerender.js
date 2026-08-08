import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

// Read paths to prerender from calculators.ts
const calculatorsPath = path.resolve(__dirname, '../src/data/calculators.ts');
const content = fs.readFileSync(calculatorsPath, 'utf8');
const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
let match;
const dynamicPaths = [];
while ((match = pathRegex.exec(content)) !== null) {
  dynamicPaths.push(match[1]);
}
const staticPaths = ['/', '/all', '/contact', '/privacy-policy', '/terms-of-service', '/about', '/suggest'];
const rawPaths = Array.from(new Set([...staticPaths, ...dynamicPaths]));
const languages = ['en', 'he', 'es', 'fr', 'ar'];

const allPaths = [];
for (const lang of languages) {
  for (const p of rawPaths) {
    allPaths.push(`/${lang}${p === '/' ? '' : p}`);
  }
}

// Simple static server for dist
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(distPath, reqPath);
  
  // If it's a known static asset file, serve it directly
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
     // do nothing, we found it
  } else {
     // Otherwise fallback to root index.html (SPA routing)
     filePath = path.join(distPath, 'index.html');
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  };
  
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
  const stream = fs.createReadStream(filePath);
  stream.on('error', (err) => {
    console.error(`Stream error for ${filePath}:`, err);
    if (!res.headersSent) {
      res.writeHead(500);
      res.end('Server error');
    }
  });
  stream.pipe(res);
});

server.listen(0, () => {
  (async () => {
    try {
      const port = server.address().port;
      console.log(`Static server listening on port ${port}`);
      
      let browser;
      try {
        browser = await chromium.launch();
      } catch (err) {
        console.log('Playwright chromium executable not found or failed to launch. Attempting auto-installation...');
        try {
          const { execSync } = await import('child_process');
          execSync('npx playwright install --with-deps chromium', { stdio: 'inherit' });
          browser = await chromium.launch();
        } catch (installErr) {
          console.warn('Warning: Playwright browser could not be launched/installed for prerendering:', installErr.message);
          console.warn('Skipping prerendering step and proceeding with SPA build output.');
          server.close();
          return;
        }
      }

      const context = await browser.newContext();
      const page = await context.newPage();
      
      console.log(`Prerendering ${allPaths.length} pages...`);
      
      for (const route of allPaths) {
        const url = `http://localhost:${port}${route}`;
        try {
          await page.goto(url, { waitUntil: 'networkidle' });
          // Remove any script tags if you want pure static (optional)
          let html = await page.content();
          // Clean up any absolute localhost/127.0.0.1 URLs generated during Playwright rendering
          const portRegex = new RegExp(`http:\\/\\/(localhost|127\\.0\\.0\\.1):${port}`, 'g');
          html = html.replace(portRegex, '');
          
          const routeDir = path.join(distPath, route);
          if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
          }
          fs.writeFileSync(path.join(routeDir, 'index.html'), html);
          console.log(`Prerendered ${route}`);
        } catch (e) {
          console.error(`Failed to prerender ${route}:`, e);
        }
      }
      
      await browser.close();
      server.close();
      console.log('Prerendering complete!');
    } catch (globalErr) {
      console.warn('Unexpected error during prerender:', globalErr?.message || globalErr);
      server.close();
    }
  })().catch((err) => {
    console.warn('Unhandled promise error in prerender:', err?.message || err);
    try { server.close(); } catch (_) {}
  });
});
