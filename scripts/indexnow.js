import fs from 'fs';

const INDEXNOW_KEY = '1a4e8d26c5bf40989f7a63581561cf29';
const INDEXNOW_KEY_LOCATION = `https://globalcalcpro.com/${INDEXNOW_KEY}.txt`;
const HOST = 'globalcalcpro.com';

async function submitIndexNow() {
  console.log('🚀 Starting IndexNow submission for Bing, Yandex, Seznam & Naver...');

  // 1. Gather all URLs from sitemap if available
  let urlList = [];
  const sitemapPaths = ['dist/sitemap.xml', 'public/sitemap.xml'];
  for (const p of sitemapPaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8');
        const matches = content.match(/<loc>(.*?)<\/loc>/g);
        if (matches && matches.length > 0) {
          urlList = matches.map(m => m.replace(/<\/?loc>/g, '').trim());
          console.log(`📄 Loaded ${urlList.length} URLs from ${p}`);
          break;
        }
      } catch (e) {
        console.warn(`Could not read sitemap from ${p}:`, e.message);
      }
    }
  }

  // Fallback if sitemap not found
  if (urlList.length === 0) {
    const langs = ['en', 'he', 'es', 'fr', 'ar'];
    const paths = [
      '',
      '/mortgage-calculator',
      '/compound-interest',
      '/percentage-finder',
      '/unit-converter',
      '/bmi-calculator',
      '/tip-calculator',
      '/salary-calculator',
      '/age-calculator',
      '/calculators/mortgage-affordability',
      '/calculators/refinance',
      '/calculators/auto-loan',
      '/calculators/rent-vs-buy',
      '/calculators/vat',
      '/calculators/margin',
      '/calculators/freelance-net-income',
      '/calculators/break-even',
      '/calculators/cap-rate',
      '/calculators/roi',
      '/calculators/inflation',
      '/calculators/goal-savings',
      '/calculators/credit-card-payoff',
      '/calculators/debt-snowball',
      '/calculators/severance-pay',
      '/calculators/currency-converter',
      '/calculators/bmr',
      '/calculators/water-intake',
      '/calculators/sleep-calculator',
      '/calculators/bill-splitter',
      '/calculators/cooking-timer',
      '/calculators/date-difference',
      '/calculators/download-time',
      '/calculators/fuel-split',
      '/calculators/peltier-cooling',
      '/all',
      '/category/finance',
      '/category/real-estate',
      '/category/health',
      '/category/math',
      '/category/tech',
      '/category/lifestyle',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms-of-service',
      '/suggest'
    ];

    for (const lang of langs) {
      for (const p of paths) {
        urlList.push(`https://${HOST}/${lang}${p}`);
      }
    }
    console.log(`⚡ Generated fallback list of ${urlList.length} multilingual URLs.`);
  }

  // Deduplicate URLs
  urlList = [...new Set(urlList)];

  // IndexNow API endpoints
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urlList
  };

  for (const endpoint of endpoints) {
    try {
      console.log(`📤 Sending ${urlList.length} URLs to IndexNow endpoint: ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok || response.status === 200 || response.status === 202) {
        console.log(`✅ IndexNow successfully submitted to ${endpoint} (Status: ${response.status})`);
      } else {
        const text = await response.text();
        console.warn(`⚠️ IndexNow responded with HTTP ${response.status} from ${endpoint}: ${text}`);
      }
    } catch (err) {
      console.error(`❌ Failed to submit to ${endpoint}:`, err.message);
    }
  }

  console.log('✨ IndexNow submission finished!');
}

submitIndexNow();
