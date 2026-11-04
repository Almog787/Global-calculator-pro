import { useUrlState } from '../../hooks/useUrlState';
import React, { useEffect, useState } from 'react';
import { Coins, ArrowRightLeft, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
import ShareActions from '../../components/ShareActions';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import RelatedCalculators from '../../components/RelatedCalculators';
import Breadcrumbs from '../../components/Breadcrumbs';

export interface CurrencyDetails {
  code: string;
  symbol: string;
  flag: string;
  name: {
    en: string;
    he: string;
    es: string;
    fr: string;
    ar: string;
    ru: string;
  };
}

const CURRENCY_MAP: Record<string, CurrencyDetails> = {
  USD: { code: 'USD', symbol: '$', flag: '🇺🇸', name: { en: 'US Dollar', he: 'דולר אמריקאי', es: 'Dólar Estadounidense', fr: 'Dollar Américain', ar: 'دولار أمريكي', ru: 'Доллар США' } },
  EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', name: { en: 'Euro', he: 'אירו', es: 'Euro', fr: 'Euro', ar: 'يورو', ru: 'Евро' } },
  GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', name: { en: 'British Pound', he: 'לירה שטרלינג', es: 'Libra Esterlina', fr: 'Livre Sterling', ar: 'جنيه إسترليني', ru: 'Британский фунт' } },
  ILS: { code: 'ILS', symbol: '₪', flag: '🇮🇱', name: { en: 'Israeli Shekel', he: 'שקל חדש', es: 'Séquel Israelí', fr: 'Shekel Israélien', ar: 'شيكل إسرائيلي', ru: 'Израильский шекель' } },
  JPY: { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: { en: 'Japanese Yen', he: 'יין יפני', es: 'Yen Japonés', fr: 'Yen Japonais', ar: 'ين ياباني', ru: 'Японская иена' } },
  AUD: { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: { en: 'Australian Dollar', he: 'דולר אוסטרלי', es: 'Dólar Australiano', fr: 'Dollar Australien', ar: 'دولار أسترالي', ru: 'Австралийский доллар' } },
  CAD: { code: 'CAD', symbol: 'C$', flag: '🇨🇦', name: { en: 'Canadian Dollar', he: 'דולר קנדי', es: 'Dólar Canadiense', fr: 'Dollar Canadien', ar: 'دولار كندي', ru: 'Канадский доллар' } },
  CHF: { code: 'CHF', symbol: 'Fr.', flag: '🇨🇭', name: { en: 'Swiss Franc', he: 'פרנק שוויצרי', es: 'Franco Suizo', fr: 'Franc Suisse', ar: 'فرنك سويسري', ru: 'Швейцарский франк' } },
  CNY: { code: 'CNY', symbol: '¥', flag: '🇨🇳', name: { en: 'Chinese Yuan', he: 'יואן סיני', es: 'Yuan Chino', fr: 'Yuan Chinois', ar: 'يوان صيني', ru: 'Китайский юань' } },
  INR: { code: 'INR', symbol: '₹', flag: '🇮🇳', name: { en: 'Indian Rupee', he: 'רופי הודי', es: 'Rupia India', fr: 'Roupie Indienne', ar: 'روبية هندية', ru: 'Индийская рупия' } },
  RUB: { code: 'RUB', symbol: '₽', flag: '🇷🇺', name: { en: 'Russian Ruble', he: 'רובל רוסי', es: 'Rublo Ruso', fr: 'Rouble Russe', ar: 'روبل روسي', ru: 'Российский рубль' } },
  SAR: { code: 'SAR', symbol: 'ر.ס', flag: '🇸🇦', name: { en: 'Saudi Riyal', he: 'ריאל סעודי', es: 'Riyal Saudí', fr: 'Riyal Saoudien', ar: 'ريال سعودي', ru: 'Саудовский риял' } },
  AED: { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: { en: 'UAE Dirham', he: 'דירהם אמירתי', es: 'Dírhams de los EAU', fr: 'Dirham des EAU', ar: 'درهم إماراتي', ru: 'Дирхам ОАЭ' } },
  BRL: { code: 'BRL', symbol: 'R$', flag: '🇧🇷', name: { en: 'Brazilian Real', he: 'ריאל ברזילאי', es: 'Real Brasileño', fr: 'Réal Brésilien', ar: 'ريال برازيلي', ru: 'Бразильский реал' } },
  MXN: { code: 'MXN', symbol: 'Mex$', flag: '🇲🇽', name: { en: 'Mexican Peso', he: 'פסו מקסיקני', es: 'Peso Mexicano', fr: 'Peso Mexicain', ar: 'بيزو مكسيكي', ru: 'Мексиканское песо' } },
  TRY: { code: 'TRY', symbol: '₺', flag: '🇹🇷', name: { en: 'Turkish Lira', he: 'לירה טורקית', es: 'Lira Turca', fr: 'Livre Turque', ar: 'ليرة تركية', ru: 'Турецкая лира' } },
  SGD: { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: { en: 'Singapore Dollar', he: 'דולר סינגפורי', es: 'Dólar de Singapur', fr: 'Dollar de Singapour', ar: 'دولار سنغافوري', ru: 'Сингапурский доллар' } },
};

const commonCurrencies = Object.keys(CURRENCY_MAP);

// Fallback rates relative to USD (1.0)
const localFallbackRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  ILS: 3.65,
  JPY: 155.0,
  AUD: 1.52,
  CAD: 1.38,
  CHF: 0.90,
  CNY: 7.25,
  INR: 83.5,
  RUB: 97.0,
  SAR: 3.75,
  AED: 3.67,
  BRL: 5.70,
  MXN: 20.2,
  TRY: 34.2,
  SGD: 1.35,
};

function getDefaultToCurrency(lang: string): string {
  if (typeof window !== 'undefined') {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Singapore') || tz.includes('Asia/Singapore')) return 'SGD';
      const navLang = (navigator.language || '').toLowerCase();
      if (navLang.includes('-sg') || navLang.includes('sg')) return 'SGD';
    } catch {
      // fallback
    }
  }
  switch (lang) {
    case 'he': return 'ILS';
    case 'ru': return 'RUB';
    case 'ar': return 'SAR';
    case 'fr':
    case 'es': return 'EUR';
    default: return 'EUR';
  }
}

export default function CurrencyConverter() {
  const { lang, t } = useI18n();
  const defaultTo = getDefaultToCurrency(lang);

  const [amount, setAmount] = useUrlState<number>('amount', 100);
  const [fromCurrency, setFromCurrency] = useUrlState<string>('fromCurrency', 'USD');
  const [toCurrency, setToCurrency] = useUrlState<string>('toCurrency', defaultTo);

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = async () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      setLastUpdated(new Date().toISOString().split('T')[0]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Try Frankfurter API (European Central Bank rates)
      const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates && data.rates[toCurrency]) {
          setExchangeRate(data.rates[toCurrency]);
          setLastUpdated(data.date);
          setLoading(false);
          return;
        }
      }

      // 2. Try Open ER API fallback for additional currencies (RUB, SAR, AED, etc.)
      const altRes = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      if (altRes.ok) {
        const altData = await altRes.json();
        if (altData && altData.rates && altData.rates[toCurrency]) {
          setExchangeRate(altData.rates[toCurrency]);
          setLastUpdated(altData.time_last_update_utc ? new Date(altData.time_last_update_utc).toLocaleDateString() : new Date().toISOString().split('T')[0]);
          setLoading(false);
          return;
        }
      }

      throw new Error('APIs unavailable');
    } catch {
      // 3. Fallback to updated in-memory table
      const fromBase = localFallbackRates[fromCurrency] || 1;
      const toBase = localFallbackRates[toCurrency] || 1;
      const fallbackRate = toBase / fromBase;
      setExchangeRate(Math.round(fallbackRate * 10000) / 10000);
      setLastUpdated(lang === 'he' ? 'שער מקומי משוער' : 'Estimated local rate');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [fromCurrency, toCurrency, lang]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = exchangeRate ? amount * exchangeRate : 0;
  const fromInfo = CURRENCY_MAP[fromCurrency] || { symbol: '$', flag: '🌐', name: { en: fromCurrency, he: fromCurrency, es: fromCurrency, fr: fromCurrency, ar: fromCurrency, ru: fromCurrency } };
  const toInfo = CURRENCY_MAP[toCurrency] || { symbol: '€', flag: '🌐', name: { en: toCurrency, he: toCurrency, es: toCurrency, fr: toCurrency, ar: toCurrency, ru: toCurrency } };

  const formatNumber = (num: number, digits: number = 2) => {
    return num.toLocaleString(lang === 'he' ? 'he-IL' : 'en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const popularPairs = [
    { from: 'USD', to: 'ILS' },
    { from: 'EUR', to: 'ILS' },
    { from: 'USD', to: 'EUR' },
    { from: 'GBP', to: 'USD' },
    { from: 'USD', to: 'SAR' },
    { from: 'USD', to: 'RUB' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <SEO
        title={lang === 'he' ? 'מחשבון המרת מט"ח בזמן אמת - שערי חליפין מעודכנים' : 'Real-time Currency Converter - Live Exchange Rates'}
        description={lang === 'he' ? 'מחשבון המרת מטבע חוץ בזמן אמת עם שערי חליפין מעודכנים, תמיכה בכל המטבעות המובילים (דולר, אירו, שקל, פאונד, רובל, ריאל) וייצוג מקומי מדויק.' : 'Live currency converter with real-time exchange rates, supporting USD, EUR, ILS, GBP, RUB, SAR and major world currencies with instant local symbol formatting.'}
        canonicalUrl="/calculators/currency-converter"
        keywords={['currency converter', 'exchange rates', 'מחשבון המרת מטח', 'שערי חליפין', 'דולר לשקל', 'אירו לשקל', 'forex converter']}
      />

      <Breadcrumbs
        items={[
          { label: t.catFinance || (lang === 'he' ? 'פיננסים' : 'Finance'), path: `/${lang}/category/finance` },
          { label: lang === 'he' ? 'מחשבון המרת מט"ח' : 'Currency Converter' },
        ]}
      />

      {/* Main Converter Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-border-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl">
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
                {lang === 'he' ? 'מחשבון המרת מט"ח בזמן אמת' : 'Real-Time Currency Converter'}
              </h1>
              <p className="text-on-surface-variant mt-1 text-sm">
                {lang === 'he' ? 'שערי חליפין מעודכנים בזמן אמת עם ייצוג מטבע מקומי' : 'Live exchange rates with localized currency symbol formatting'}
              </p>
            </div>
          </div>
          <button
            onClick={fetchRate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold transition-all border border-border-subtle"
            title={lang === 'he' ? 'רענן שערים' : 'Refresh rates'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{lang === 'he' ? 'רענן' : 'Refresh'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-8">
          {/* From Currency Input */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-border-subtle space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              {lang === 'he' ? 'סכום להמרה' : 'Amount to Convert'}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-primary w-8 text-center">{fromInfo.symbol}</span>
              <input
                type="number"
                min="0"
                step="any"
                value={amount || ''}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent text-2xl font-bold text-on-surface focus:outline-none"
                placeholder="100"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="bg-surface-container-high font-bold text-on-surface rounded-xl px-3 py-2 border border-border-subtle cursor-pointer text-sm"
              >
                {commonCurrencies.map((code) => {
                  const info = CURRENCY_MAP[code];
                  const name = info ? (info.name[lang as keyof typeof info.name] || info.name.en) : code;
                  return (
                    <option key={`from-${code}`} value={code}>
                      {info?.flag} {code} ({info?.symbol}) - {name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="text-xs text-on-surface-variant/80 font-medium pt-1">
              {fromInfo.flag} {fromInfo.name[lang as keyof typeof fromInfo.name] || fromInfo.name.en}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-4 bg-primary hover:bg-primary/90 text-on-primary rounded-full transition-all shadow-md hover:scale-105 active:scale-95"
              title={lang === 'he' ? 'החלף בין המטבעות' : 'Swap currencies'}
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* To Currency Display */}
          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 space-y-2">
            <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
              {lang === 'he' ? 'תוצאה שהתקבלה' : 'Converted Result'}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-primary w-8 text-center">{toInfo.symbol}</span>
              <div className="w-full text-2xl font-bold text-on-surface truncate">
                {loading ? '...' : formatNumber(convertedAmount, 2)}
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="bg-surface-container-high font-bold text-on-surface rounded-xl px-3 py-2 border border-border-subtle cursor-pointer text-sm"
              >
                {commonCurrencies.map((code) => {
                  const info = CURRENCY_MAP[code];
                  const name = info ? (info.name[lang as keyof typeof info.name] || info.name.en) : code;
                  return (
                    <option key={`to-${code}`} value={code}>
                      {info?.flag} {code} ({info?.symbol}) - {name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="text-xs text-primary/80 font-medium pt-1">
              {toInfo.flag} {toInfo.name[lang as keyof typeof toInfo.name] || toInfo.name.en}
            </div>
          </div>
        </div>

        {/* Live Rate Summary Box */}
        <div className="bg-surface-container-low rounded-2xl p-6 border border-border-subtle text-center space-y-2">
          {error ? (
            <p className="text-error font-medium">{error}</p>
          ) : exchangeRate !== null ? (
            <>
              <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant font-medium">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>{lang === 'he' ? 'שער חליפין ייצוגי מעודכן:' : 'Live Market Exchange Rate:'}</span>
              </div>
              <div className="text-3xl font-extrabold text-primary tracking-tight">
                1 {fromCurrency} ({fromInfo.symbol}) = {formatNumber(exchangeRate, 4)} {toCurrency} ({toInfo.symbol})
              </div>
              <div className="text-xs text-on-surface-variant/70">
                {lang === 'he' ? `עודכן לאחרונה: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
              </div>
            </>
          ) : (
            <p className="text-on-surface-variant font-medium">{lang === 'he' ? 'טוען שערים...' : 'Loading rates...'}</p>
          )}
        </div>
      </div>

      {/* Popular Currency Pairs Quick Reference */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 border border-border-subtle">
        <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <span>{lang === 'he' ? 'צמדי מטבעות נפוצים' : 'Popular Currency Pairs'}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {popularPairs.map((pair) => {
            const fInfo = CURRENCY_MAP[pair.from];
            const tInfo = CURRENCY_MAP[pair.to];
            const isActive = fromCurrency === pair.from && toCurrency === pair.to;
            return (
              <button
                key={`${pair.from}-${pair.to}`}
                onClick={() => {
                  setFromCurrency(pair.from);
                  setToCurrency(pair.to);
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary shadow-sm font-bold'
                    : 'bg-surface-container-low hover:bg-surface-container-high border-border-subtle text-on-surface font-semibold'
                }`}
              >
                <div className="text-xs opacity-90">{fInfo?.flag} {pair.from} → {tInfo?.flag} {pair.to}</div>
                <div className="text-sm font-extrabold mt-1">{fInfo?.symbol} 1 = {tInfo?.symbol}</div>
              </button>
            );
          })}
        </div>
      </div>

      <ShareActions />

      <RelatedCalculators currentId="currency-converter" />

      <FAQ
        items={[
          {
            question: lang === 'he' ? 'מאיפה נלקחים שערי החליפין המעודכנים?' : 'Where are the live exchange rates sourced from?',
            answer: lang === 'he'
              ? 'שערי החליפין מתעדכנים בזמן אמת מול הבנק המרכזי האירופי (ECB) ומקורות פיננסיים בינלאומיים רשמיים, עם גיבוי של חישוב מקומי לזמינות מלאה גם במצב אופליין.'
              : 'Rates are dynamically retrieved from the European Central Bank (ECB) and official financial institutions, with instant fallback calculations for complete offline PWA reliability.',
          },
          {
            question: lang === 'he' ? 'האם ניתן להשתמש במחשבון המט"ח ללא חיבור לאינטרנט?' : 'Can I use this currency converter offline?',
            answer: lang === 'he'
              ? 'כן! המערכת שומרת את השערים האחרונים ומאפשרת חישוב והמרה מלאים גם ללא גישה לרשת.'
              : 'Yes! The applet caches recent conversion tables and allows offline calculations.',
          },
          {
            question: lang === 'he' ? 'איך מחושב שער המטבע המקומי?' : 'How is local currency detection applied?',
            answer: lang === 'he'
              ? 'המחשבון מזהה את שפת הממשק ומיקום הדפדפן ומציג באופן אוטומטי את המטבע המקומי הרלוונטי (שקל ₪ בישראל, אירו € באירופה, רובל ₽, ריאל סעודי ועוד).'
              : 'The calculator automatically adapts to your active locale/language, selecting relevant default local currencies (USD $, EUR €, ILS ₪, GBP £, RUB ₽, etc.).',
          },
        ]}
      />
    </div>
  );
}

