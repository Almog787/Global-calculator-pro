import fs from 'fs';
import path from 'path';
import https from 'https';

const fontsDir = path.resolve('public/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

// User Agent for modern WOFF2 support
const WOFF2_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function downloadFonts() {
  const cssUrls = [
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
  ];

  let combinedLocalCss = '';
  let fontIndex = 0;

  for (const cssUrl of cssUrls) {
    console.log(`Fetching CSS from: ${cssUrl}`);
    const cssBuffer = await fetchUrl(cssUrl, { 'User-Agent': WOFF2_UA });
    let cssText = cssBuffer.toString('utf-8');

    // Find all font URLs in CSS: url(https://...)
    const fontUrlRegex = /url\((https:\/\/[^)]+)\)/g;
    let match;

    while ((match = fontUrlRegex.exec(cssText)) !== null) {
      const remoteFontUrl = match[1];
      fontIndex++;
      const ext = remoteFontUrl.endsWith('.woff2') ? '.woff2' : '.woff';
      const localFileName = `font-${fontIndex}${ext}`;
      const localFilePath = path.join(fontsDir, localFileName);

      console.log(`Downloading font file ${fontIndex}: ${remoteFontUrl}`);
      const fontBuffer = await fetchUrl(remoteFontUrl);
      fs.writeFileSync(localFilePath, fontBuffer);

      // Replace in CSS with local path
      cssText = cssText.replace(remoteFontUrl, `/fonts/${localFileName}`);
    }

    combinedLocalCss += cssText + '\n\n';
  }

  // Save the combined local fonts.css
  fs.writeFileSync(path.join(fontsDir, 'fonts.css'), combinedLocalCss);
  console.log('All font files downloaded and saved to public/fonts/');
}

downloadFonts().catch((err) => {
  console.error('Error downloading fonts:', err);
  process.exit(1);
});
