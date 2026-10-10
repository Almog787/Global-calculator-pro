import fs from 'fs';

const SITEMAP_URL = 'https://globalcalcpro.com/sitemap.xml';

async function pingSitemaps() {
  console.log('📡 Starting Manual Search Engine Sitemap Ping & Submission Check...');
  console.log(`🔗 Target Sitemap: ${SITEMAP_URL}`);

  const pingTargets = [
    {
      engine: 'Google (Search Console Ping endpoint)',
      url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
      engine: 'Bing (Bing Webmaster Tools Ping)',
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
      engine: 'Yandex (Yandex Ping)',
      url: `https://blogs.yandex.ru/pings/?status=success&url=${encodeURIComponent(SITEMAP_URL)}`
    }
  ];

  for (const target of pingTargets) {
    try {
      console.log(`\n📤 Pinging ${target.engine}...`);
      const res = await fetch(target.url, { method: 'GET' });
      console.log(`✅ ${target.engine} responded with HTTP ${res.status} (${res.statusText})`);
    } catch (err) {
      console.warn(`⚠️ Ping to ${target.engine} returned: ${err.message}`);
    }
  }

  // Validate sitemap files locally
  const localSitemaps = ['dist/sitemap.xml', 'public/sitemap.xml'];
  for (const s of localSitemaps) {
    if (fs.existsSync(s)) {
      const xml = fs.readFileSync(s, 'utf8');
      const count = (xml.match(/<loc>/g) || []).length;
      console.log(`\n📋 Local sitemap verified: ${s} (${count} URLs defined)`);
    }
  }

  console.log('\n✨ Sitemap Ping & Verification Complete!');
}

pingSitemaps();
