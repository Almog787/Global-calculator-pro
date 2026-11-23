import fs from 'fs';
import { execFileSync } from 'child_process';

const INDEXNOW_KEY = '4d34065b458d434790086c9693b9c095';
const INDEXNOW_KEY_LOCATION = `https://globalcalcpro.com/${INDEXNOW_KEY}.txt`;
const HOST = 'globalcalcpro.com';
const BASE_URL = `https://${HOST}`;
const LANGUAGES = ['en', 'he', 'es', 'fr', 'ar', 'ru'];

const STATIC_FILE_MAP = {
  '/all': 'src/pages/AllCalculators.tsx',
  '/widgets': 'src/pages/WidgetsHub.tsx',
  '/about': 'src/pages/AboutUs.tsx',
  '/contact': 'src/pages/ContactUs.tsx',
  '/privacy-policy': 'src/pages/PrivacyPolicy.tsx',
  '/terms-of-service': 'src/pages/TermsOfService.tsx',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseSitemapXml(xml) {
  const entries = [];
  const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
  let match;
  while ((match = urlBlockRegex.exec(xml)) !== null) {
    const block = match[1];
    const locMatch = /<loc>(.*?)<\/loc>/.exec(block);
    if (!locMatch) continue;
    const loc = locMatch[1].trim();
    const lastmodMatch = /<lastmod>(.*?)<\/lastmod>/.exec(block);
    const lastmod = lastmodMatch ? lastmodMatch[1].trim() : null;
    entries.push({ loc, lastmod });
  }
  return entries;
}

function loadCurrentSitemap() {
  const sitemapPaths = ['dist/sitemap.xml', 'public/sitemap.xml'];
  for (const p of sitemapPaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8');
        const entries = parseSitemapXml(content);
        if (entries.length > 0) {
          console.log(`📄 Loaded ${entries.length} canonical URLs from ${p}`);
          return { path: p, content, entries };
        }
      } catch (err) {
        console.warn(`Could not read sitemap from ${p}:`, err.message);
      }
    }
  }
  return { path: null, content: '', entries: [] };
}

function resolveSourceFileForPath(routePath) {
  if (STATIC_FILE_MAP[routePath]) return STATIC_FILE_MAP[routePath];
  if (routePath.startsWith('/category/')) return 'src/data/categoryHubs.ts';
  const slug = routePath.replace(/^\/calculators\//, '').replace(/^\//, '');
  const pascal = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `src/pages/calculators/${pascal}.tsx`;
}

function runGit(args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function detectChangedUrls(entries) {
  if (!fs.existsSync('.git')) return [];

  const canonicalSet = new Set(entries.map((e) => e.loc));
  const candidates = new Set();

  // Determine comparison range (look back past any [skip ci] auto-commit from deploy.yml)
  const recentCommits = runGit(['log', '-n', '5', '--format=%H %s'])
    .split('\n')
    .filter(Boolean);

  let baseRef = 'HEAD~1';
  if (recentCommits.length >= 2 && recentCommits[0].includes('[skip ci]')) {
    baseRef = recentCommits.length >= 3 ? 'HEAD~2' : 'HEAD~1';
  }

  // 1. Compare sitemap.xml <loc> + <lastmod> changes against baseRef
  const prevSitemapXml = runGit(['show', `${baseRef}:public/sitemap.xml`]);
  if (prevSitemapXml) {
    const prevMap = new Map(parseSitemapXml(prevSitemapXml).map((e) => [e.loc, e.lastmod]));
    for (const entry of entries) {
      const prevMod = prevMap.get(entry.loc);
      if (!prevMap.has(entry.loc) || (entry.lastmod && entry.lastmod !== prevMod)) {
        candidates.add(entry.loc);
      }
    }
  }

  // 2. Map changed page/calculator source files in recent commit range to their localized URLs
  const changedFiles = runGit(['diff', '--name-only', baseRef, 'HEAD'])
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);

  if (changedFiles.length > 0) {
    const changedFileSet = new Set(changedFiles);
    for (const entry of entries) {
      const routePath = entry.loc.replace(new RegExp(`^${BASE_URL}/(?:${LANGUAGES.join('|')})`), '');
      const sourceFile = resolveSourceFileForPath(routePath);
      if (changedFileSet.has(sourceFile)) {
        candidates.add(entry.loc);
      }
    }
  }

  return [...candidates].filter((u) => canonicalSet.has(u));
}

function filterRecentUrls(entries, days) {
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  return entries
    .filter((e) => e.lastmod && e.lastmod >= cutoff)
    .map((e) => e.loc);
}

async function streamUrlGet(endpoint, url) {
  const params = new URLSearchParams({
    url,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
  });
  const targetUrl = `${endpoint}?${params.toString()}`;
  return fetch(targetUrl, { method: 'GET' });
}

async function submitIndexNow() {
  const cliUrls = process.argv.slice(2).filter((arg) => arg.startsWith('https://'));
  const envUrls = (process.env.INDEXNOW_URLS || '')
    .split(/[\s,]+/)
    .map((u) => u.trim())
    .filter((u) => u.startsWith(`https://${HOST}/`));

  const explicitUrls = [...new Set([...cliUrls, ...envUrls])];
  const mode = (
    explicitUrls.length > 0
      ? 'urls'
      : process.env.INDEXNOW_MODE || 'changed'
  ).toLowerCase().trim();

  const delayMs = Math.max(100, Number(process.env.INDEXNOW_DELAY_MS || 250) || 250);
  const recentDays = Math.max(1, Number(process.env.INDEXNOW_RECENT_DAYS || 7) || 7);
  const maxAutoUrls = Math.max(1, Number(process.env.INDEXNOW_MAX_URLS || 120) || 120);

  console.log(`🚀 Starting IndexNow Streaming submission (mode=${mode}, delay=${delayMs}ms)...`);

  const { entries } = loadCurrentSitemap();
  let urlList = [];

  if (mode === 'urls') {
    urlList = explicitUrls;
  } else if (mode === 'recent') {
    urlList = filterRecentUrls(entries, recentDays);
    console.log(`🗓️ Filtered ${urlList.length} URLs updated in the last ${recentDays} days.`);
  } else if (mode === 'all') {
    urlList = entries.map((e) => e.loc);
    console.log(`🌐 Full stream mode selected (${urlList.length} canonical URLs).`);
  } else {
    // Default 'changed' streaming mode
    urlList = detectChangedUrls(entries);
    console.log(`🔍 Detected ${urlList.length} added/updated URLs since previous commit.`);
    if (urlList.length > maxAutoUrls) {
      console.log(`🛡️ Capping automatic stream to ${maxAutoUrls} URLs to avoid crawl spikes.`);
      urlList = urlList.slice(0, maxAutoUrls);
    }
  }

  urlList = [...new Set(urlList)].filter((u) => u.startsWith(`https://${HOST}/`));

  if (urlList.length === 0) {
    console.log('ℹ️ No changed URLs to submit. Streaming mode skips redundant submissions.');
    return;
  }

  // Per IndexNow specification, submitting to one endpoint (api.indexnow.org) shares URLs across Bing, Yandex, Seznam & Naver automatically.
  // Avoid parallel duplicate submissions of the same URLs across multiple engines at once.
  const targetEngine = (process.env.INDEXNOW_TARGET || 'all').toLowerCase().trim();
  const engineEndpointMap = {
    all: ['https://api.indexnow.org/indexnow'],
    bing: ['https://www.bing.com/indexnow'],
    yandex: ['https://yandex.com/indexnow'],
    naver: ['https://searchadvisor.naver.com/indexnow'],
  };
  const endpoints = engineEndpointMap[targetEngine] || engineEndpointMap.all;

  for (const endpoint of endpoints) {
    console.log(`📡 Streaming ${urlList.length} URLs individually to ${endpoint}...`);
    let successCount = 0;
    let rateLimited = false;

    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i];
      try {
        let response = await streamUrlGet(endpoint, url);

        if (response.status === 429 || response.status === 503) {
          const retryAfterSec = Number(response.headers.get('retry-after') || 5) || 5;
          console.warn(`⏳ Rate limit/backoff (HTTP ${response.status}) on ${url}. Waiting ${retryAfterSec}s...`);
          await sleep(retryAfterSec * 1000);
          response = await streamUrlGet(endpoint, url);
        }

        if (response.ok || response.status === 200 || response.status === 202) {
          successCount++;
          console.log(`✅ [${i + 1}/${urlList.length}] Streamed: ${url} (HTTP ${response.status})`);
        } else {
          const text = await response.text();
          console.warn(`⚠️ [${i + 1}/${urlList.length}] HTTP ${response.status} for ${url}: ${text}`);
          if (response.status === 429) {
            rateLimited = true;
            break;
          }
        }
      } catch (err) {
        console.error(`❌ [${i + 1}/${urlList.length}] Failed for ${url}:`, err.message);
      }

      if (i < urlList.length - 1) {
        await sleep(delayMs);
      }
    }

    console.log(
      `✨ Finished streaming to ${endpoint}: ${successCount}/${urlList.length} accepted${rateLimited ? ' (stopped early due to 429)' : ''}.`,
    );
  }
}

submitIndexNow();
