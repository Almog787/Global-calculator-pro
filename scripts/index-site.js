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

  // Deduplicate URLs
  urls = [...new Set(urls)];

  // Optional language filter (e.g. 'he', 'en', 'ar', etc.)
  const langFilter = (process.env.INDEXING_LANG_FILTER || 'all').toLowerCase().trim();
  if (langFilter && langFilter !== 'all') {
    const langPrefix = `https://globalcalcpro.com/${langFilter}/`;
    urls = urls.filter((u) => u.startsWith(langPrefix) || u === `https://globalcalcpro.com/${langFilter}`);
    console.log(`🌐 Filtered to language "${langFilter}": ${urls.length} URLs`);
  }

  // Automatic batch rotation to respect Google Indexing API's 200 requests/day default quota
  const batchMode = (process.env.INDEXING_BATCH_MODE || 'auto').toLowerCase().trim();
  const batchLimit = Math.max(1, Math.min(200, Number(process.env.INDEXING_BATCH_LIMIT || 195) || 195));

  if (batchMode !== 'all' && urls.length > batchLimit) {
    const totalBatches = Math.ceil(urls.length / batchLimit);
    let batchIndex = 0;
    if (batchMode.startsWith('batch_')) {
      const parsed = parseInt(batchMode.replace('batch_', ''), 10);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= totalBatches) {
        batchIndex = parsed - 1;
      }
    } else {
      // 'auto': rotate deterministically by UTC day so every batch runs automatically on schedule
      const utcDay = Math.floor(Date.now() / 86400000);
      batchIndex = utcDay % totalBatches;
    }
    const start = batchIndex * batchLimit;
    const end = Math.min(start + batchLimit, urls.length);
    console.log(
      `📦 Batch ${batchIndex + 1}/${totalBatches} (mode=${batchMode}): submitting URLs ${start + 1}–${end} of ${urls.length} total.`,
    );
    urls = urls.slice(start, end);
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

    const actionType = process.env.INDEXING_ACTION_TYPE === 'URL_DELETED' ? 'URL_DELETED' : 'URL_UPDATED';
    console.log(`🚀 Requesting Google Indexing (${actionType}) for ${urls.length} URLs...`);

    const BATCH_SIZE = 5;
    let shouldStop = false;
    let successCount = 0;

    for (let i = 0; i < urls.length && !shouldStop; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (url) => {
          if (shouldStop) return;
          try {
            const res = await indexing.urlNotifications.publish({
              requestBody: {
                url: url,
                type: actionType,
              },
            });
            successCount++;
            console.log(`✅ Indexing requested: ${url} (Status: ${res.status})`);
          } catch (urlErr) {
            console.error(`⚠️ Indexing failed for ${url}:`, urlErr.message);

            if (urlErr.message && urlErr.message.includes('has been deleted')) {
              console.error('\n🛑 FATAL ERROR: The Google Cloud Project associated with this Service Account has been deleted.');
              shouldStop = true;
            } else if (urlErr.message && (urlErr.message.includes('invalid_grant') || urlErr.message.includes('Permission denied') || urlErr.message.includes('has not been used in project'))) {
              console.error('\n🛑 FATAL AUTH/PERMISSIONS ERROR:', urlErr.message);
              console.error('👉 Verify that the Indexing API is enabled and the Service Account has Owner permissions in Google Search Console.');
              shouldStop = true;
            } else if (urlErr.message && (urlErr.message.includes('Quota exceeded') || urlErr.code === 429)) {
              console.log('\n🛑 Quota exceeded (200/day limit). Remaining URLs will run automatically in the next scheduled batch.');
              shouldStop = true;
            }
          }
        })
      );
    }

    console.log(`✨ Google Indexing API execution completed! (${successCount}/${urls.length} URLs submitted)`);
  } catch (err) {
    console.error('❌ Google Indexing API Error:', err.message);
  }
}

indexSite();
