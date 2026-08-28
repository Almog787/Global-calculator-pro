import React, { useState, useEffect } from 'react';
import { Coins, ArrowRightLeft } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
import ShareActions from '../../components/ShareActions';

const commonCurrencies = [
  'USD', 'EUR', 'GBP', 'ILS', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'
];

export default function CurrencyConverter() {
  const { lang, t } = useI18n();
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>(lang === 'he' ? 'ILS' : 'EUR');
  
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        // Using Frankfurter API which is free and open source, no API key required
        const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        const data = await response.json();
        setExchangeRate(data.rates[toCurrency]);
        setLastUpdated(data.date);
      } catch (err) {
        setError(lang === 'he' ? 'שגיאה בטעינת שערי חליפין' : 'Error loading exchange rates');
        setExchangeRate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency, lang]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = exchangeRate ? amount * exchangeRate : 0;

  const isRtl = t.dir === 'rtl';

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-border-subtle">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <Coins className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
            {lang === 'he' ? 'מחשבון המרת מט"ח בזמן אמת' : 'Real-time Currency Converter'}
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            {lang === 'he' ? 'שערי חליפין מעודכנים לפי הבנק המרכזי האירופי' : 'Live exchange rates based on European Central Bank'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end mb-8 relative">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2">
            {lang === 'he' ? 'סכום להמרה' : 'Amount'}
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              min="0"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="absolute ltr:right-2 rtl:left-2 bg-transparent border-0 text-on-surface font-semibold focus:ring-0 cursor-pointer"
            >
              {commonCurrencies.map(c => <option key={`from-${c}`} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center pb-2">
          <button
            onClick={handleSwap}
            className="p-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full transition-colors shadow-sm"
            title={lang === 'he' ? 'החלף מטבעות' : 'Swap currencies'}
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2">
            {lang === 'he' ? 'הסכום שהתקבל' : 'Converted Amount'}
          </label>
          <div className="relative flex items-center">
            <div className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface opacity-70 h-[52px] flex items-center">
               {loading ? '...' : convertedAmount.toLocaleString(lang === 'he' ? 'he-IL' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="absolute ltr:right-2 rtl:left-2 bg-transparent border-0 text-on-surface font-semibold focus:ring-0 cursor-pointer"
            >
              {commonCurrencies.map(c => <option key={`to-${c}`} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
        {error ? (
          <p className="text-error">{error}</p>
        ) : exchangeRate !== null ? (
          <>
            <p className="text-sm text-on-surface-variant mb-2">
              {lang === 'he' ? 'שער חליפין נוכחי' : 'Current Exchange Rate'}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-primary mb-2">
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </p>
            {lastUpdated && (
              <p className="text-xs text-on-surface-variant/70">
                {lang === 'he' ? `עודכן לאחרונה: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
              </p>
            )}
          </>
        ) : (
          <p className="text-on-surface-variant">...</p>
        )}
      </div>

      <ShareActions />
    </div>
  );
}
