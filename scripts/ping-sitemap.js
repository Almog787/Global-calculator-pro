import fs from 'fs';

const SITEMAP_URL = process.env.SITEMAP_URL || 'https://globalcalcpro.com/sitemap.xml';
const ROBOTS_URL = 'https://globalcalcpro.com/robots.txt';

async function pingSitemaps() {
  console.log('📡 Starting Search Engine Sitemap Health & Ping Check...');
  console.log(`🔗 Target Sitemap: ${SITEMAP_URL}`);

  const checks = [
    {
      name: 'Live Sitemap Accessibility (HTTP 200)',
      url: SITEMAP_URL,
      strict: true,
    },
    {
      name: 'Live robots.txt Accessibility (HTTP 200)',
      url: ROBOTS_URL,
      strict: true,
    },
    {
      name: 'Bing Sitemap Ping',
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
      strict: false,
    },
  ];

  let hasError = false;

  await Promise.all(
    checks.map(async (target) => {
      try {
        console.log(`\n📤 Checking ${target.name}...`);
        const res = await fetch(target.url, { method: 'GET' });
        console.log(`✅ ${target.name} responded with HTTP ${res.status} (${res.statusText})`);
        if (target.strict && !res.ok) {
          hasError = true;
        }
      } catch (err) {
        console.warn(`⚠️ Request to ${target.name} returned: ${err.message}`);
        if (target.strict) hasError = true;
      }
    })
  );

  // Validate sitemap files locally
  const localSitemaps = ['dist/sitemap.xml', 'public/sitemap.xml'];
  for (const s of localSitemaps) {
    if (fs.existsSync(s)) {
      const xml = fs.readFileSync(s, 'utf8');
      const count = (xml.match(/<loc>/g) || []).length;
      console.log(`\n📋 Local sitemap verified: ${s} (${count} URLs defined)`);
    }
  }

  if (hasError) {
    process.exitCode = 1;
  } else {
    console.log('\n✨ Sitemap Health & Verification Complete!');
  }
}

pingSitemaps();
