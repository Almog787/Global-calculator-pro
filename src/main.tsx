import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { I18nProvider } from './contexts/i18n';
import { HistoryProvider } from './contexts/HistoryContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <I18nProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Register Service Worker for offline asset caching and speed improvements
// Skip automated crawlers/headless renderers (e.g. Googlebot WRS) and ignore rejected registrations cleanly
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const isAutomatedAgent =
    Boolean(navigator.webdriver) ||
    /bot|googlebot|bingbot|crawler|spider|slurp|yandex|baidu|duckduckbot|inspectiontool/i.test(
      navigator.userAgent || '',
    );

  if (!isAutomatedAgent) {
    window.addEventListener('load', () => {
      Promise.resolve(navigator.serviceWorker.register('/sw.js')).catch(() => {
        // Ignore expected rejections in headless renderers (Googlebot WRS), private modes, or restricted iframes
      });
    });
  }
}

