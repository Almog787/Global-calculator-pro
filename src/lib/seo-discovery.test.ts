import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('SEO & AI Knowledge Discovery Suite', () => {
  const rootDir = process.cwd();
  const validLanguages = ['en', 'he', 'es', 'fr', 'ar'];

  describe('robots.txt AI Crawlers Configuration', () => {
    const robotsPath = path.join(rootDir, 'public/robots.txt');
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');

    it('should explicitly allow major AI search engines and answer bots', () => {
      const expectedBots = [
        'OAI-SearchBot',
        'GPTBot',
        'PerplexityBot',
        'Claude-Web',
        'ClaudeBot',
        'Google-Extended',
        'Applebot-Extended',
        'Bingbot',
        'Googlebot'
      ];

      for (const bot of expectedBots) {
        expect(robotsContent).toContain(`User-agent: ${bot}`);
      }
    });

    it('should reference sitemap and direct AI specification files in robots.txt', () => {
      expect(robotsContent).toContain('Sitemap: https://globalcalcpro.com/sitemap.xml');
      expect(robotsContent).toContain('https://globalcalcpro.com/llms.txt');
      expect(robotsContent).toContain('https://globalcalcpro.com/llms-full.txt');
      expect(robotsContent).toContain('https://globalcalcpro.com/en/widgets');
    });
  });

  describe('llms.txt & llms-full.txt Specifications', () => {
    const llmsPath = path.join(rootDir, 'public/llms.txt');
    const llmsContent = fs.readFileSync(llmsPath, 'utf8');

    const llmsFullPath = path.join(rootDir, 'public/llms-full.txt');
    const llmsFullContent = fs.readFileSync(llmsFullPath, 'utf8');

    it('should document the Embeddable Widgets Hub in llms.txt', () => {
      expect(llmsContent).toContain('https://globalcalcpro.com/en/widgets');
      expect(llmsContent).toContain('Embeddable Widgets Hub');
    });

    it('should document side-by-side scenario comparisons in llms.txt and llms-full.txt', () => {
      expect(llmsContent).toContain('scenario comparison');
      expect(llmsFullContent).toContain('Side-by-Side Scenario Comparison Engine');
      expect(llmsFullContent).toContain('compareMortgages');
      expect(llmsFullContent).toContain('compareCompoundInterest');
    });

    it('should document Excel export and Decimal.js precision engine in llms.txt and llms-full.txt', () => {
      expect(llmsContent).toContain('Excel (.xlsx)');
      expect(llmsContent).toContain('Decimal.js');
      expect(llmsFullContent).toContain('exportMortgageToExcel');
      expect(llmsFullContent).toContain('exportCompoundToExcel');
      expect(llmsFullContent).toContain('High-Precision Decimal Arithmetic Engine');
    });

    it('should document iframe embed format and widget slugs in llms-full.txt', () => {
      expect(llmsFullContent).toContain('Embeddable Widgets & Calculators Hub');
      expect(llmsFullContent).toContain('?embed=true');
      expect(llmsFullContent).toContain('mortgage-calculator');
      expect(llmsFullContent).toContain('compound-interest');
      expect(llmsFullContent).toContain('salary-calculator');
      expect(llmsFullContent).toContain('bmi-calculator');
    });
  });

  describe('sitemap.xml Multilingual Coverage', () => {
    const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    it('should include all 5 language endpoints for /widgets in sitemap.xml', () => {
      for (const lang of validLanguages) {
        expect(sitemapContent).toContain(`<loc>https://globalcalcpro.com/${lang}/widgets</loc>`);
      }
    });

    it('should include x-default hreflang pointing to English for /widgets', () => {
      expect(sitemapContent).toContain(
        '<xhtml:link rel="alternate" hreflang="x-default" href="https://globalcalcpro.com/en/widgets"/>'
      );
    });
  });

  describe('metadata.json & index.html Synchronization', () => {
    const metadataPath = path.join(rootDir, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    const indexPath = path.join(rootDir, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf8');

    it('should synchronize app name in metadata.json and index.html', () => {
      expect(metadata.name).toBe('Global Calculator Pro');
      expect(indexHtml).toContain(`<title>${metadata.name} – Free Financial, Mortgage & Math Suite</title>`);
      expect(indexHtml).toContain(`<meta property="og:title" content="${metadata.name} – Free Financial, Mortgage & Math Suite" />`);
    });

    it('should synchronize meta description in metadata.json and index.html', () => {
      expect(metadata.description).toBeTruthy();
      expect(indexHtml).toContain(`<meta name="description" content="${metadata.description}" />`);
      expect(indexHtml).toContain(`<meta property="og:description" content="${metadata.description}" />`);
    });
  });
});
