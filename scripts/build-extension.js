const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building app for extension...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Creating extension package...');
const distDir = path.join(__dirname, '../dist');
const extDir = path.join(__dirname, '../dist-extension');

// Copy dist to dist-extension
if (fs.existsSync(extDir)) {
  fs.rmSync(extDir, { recursive: true, force: true });
}
execSync(`cp -r ${distDir} ${extDir}`);

// Replace manifest
fs.copyFileSync(
  path.join(__dirname, '../public/manifest.extension.json'),
  path.join(extDir, 'manifest.json')
);

// We need to modify the index.html slightly for extension (e.g., removing module scripts if not allowed, or just keeping it)
// Vite handles it fine for popup extensions.

console.log('Extension package created in /dist-extension');
