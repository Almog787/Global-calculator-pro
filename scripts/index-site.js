import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Try loading local .env if available
try {
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  // Ignore env read error
}

async function indexSite() {
  const serviceAccountKeyRaw =
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    process.env.GCP_SA_KEY ||
    process.env.SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountKeyRaw) {
    console.log('⚠️ GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set. Skipping Google Indexing submission.');
    return;
  }

  let credentials;
  try {
    const trimmed = serviceAccountKeyRaw.trim();
    if (trimmed.startsWith('{')) {
      credentials = JSON.parse(trimmed);
    } else if (fs.existsSync(trimmed)) {
      credentials = JSON.parse(fs.readFileSync(trimmed, 'utf8'));
    } else {
      // Try base64 decoding
      const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
      credentials = JSON.parse(decoded);
    }

    // Ensure private_key handles escaped newline characters from CI/CD secrets
    if (credentials && credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
  } catch (err) {
    console.error('❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', err.message);
    return;
  }

  if (!credentials || !credentials.client_email || !credentials.private_key) {
    console.error('❌ Invalid Service Account JSON: Missing client_email or private_key.');
    return;
  }

  console.log(`🔑 Service Account loaded for: ${credentials.client_email}`);

  // Extract URLs from sitemap if available or fallback to list
  let urls = [
    'https://globalcalcpro.com/',
    'https://globalcalcpro.com/mortgage-calculator',
    'https://globalcalcpro.com/compound-interest',
    'https://globalcalcpro.com/percentage-finder',
    'https://globalcalcpro.com/unit-converter',
    'https://globalcalcpro.com/bmi-calculator',
    'https://globalcalcpro.com/tip-calculator',
    'https://globalcalcpro.com/salary-calculator',
    'https://globalcalcpro.com/age-calculator',
    'https://globalcalcpro.com/contact',
    'https://globalcalcpro.com/privacy-policy',
    'https://globalcalcpro.com/terms-of-service',
    'https://globalcalcpro.com/about',
    'https://globalcalcpro.com/suggest'
  ];

  try {
    const sitemapPath = fs.existsSync('dist/sitemap.xml')
      ? 'dist/sitemap.xml'
      : fs.existsSync('public/sitemap.xml')
      ? 'public/sitemap.xml'
      : null;

    if (sitemapPath) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const matches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
      if (matches && matches.length > 0) {
        urls = matches.map(m => m.replace(/<\/?loc>/g, '').trim());
      }
    }
  } catch (e) {
    // fallback to predefined list
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing({
      version: 'v3',
      auth,
    });

    console.log(`🚀 Requesting Google Indexing for ${urls.length} URLs...`);

    for (const url of urls) {
      try {
        const res = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`✅ Indexing requested: ${url} (Status: ${res.status})`);
      } catch (urlErr) {
        console.error(`⚠️ Indexing failed for ${url}:`, urlErr.message);
      }
    }

    console.log('✨ Google Indexing API execution completed!');
  } catch (err) {
    console.error('❌ Google Indexing API Error:', err.message);
  }
}

indexSite();
