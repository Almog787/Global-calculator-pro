import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/i18n';

export default function NotFound() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/${lang}`, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, lang]);

  return (
    <div id="not-found-page" className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div id="not-found-card" className="bg-white border border-stone-200 shadow-sm rounded-2xl p-8 sm:p-12 max-w-md w-full flex flex-col items-center">
        {/* Visual Badge */}
        <div id="not-found-icon-container" className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-xs border border-blue-100">
          <span className="material-symbols-outlined text-4xl">search_off</span>
        </div>

        <h1 id="not-found-code" className="text-6xl font-black tracking-tight text-stone-900 mb-2">
          404
        </h1>

        <h2 id="not-found-title" className="text-xl font-bold text-stone-800 mb-3">
          {t.notFoundTitle || 'Page Not Found'}
        </h2>

        <p id="not-found-description" className="text-stone-600 text-sm leading-relaxed mb-6">
          {t.notFoundDesc || 'The page you are looking for does not exist or has been moved.'}
        </p>

        {/* Action Button */}
        <Link
          id="not-found-home-button"
          to={`/${lang}`}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md text-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">home</span>
          <span>{t.backToHome || 'Back to Home'}</span>
        </Link>

        {/* Auto Redirect Notice */}
        <p id="not-found-countdown" className="text-xs text-stone-600 mt-5">
          {t.dir === 'rtl' 
            ? `מעביר חזרה לדף הבית באופן אוטומטי תוך ${countdown} שניות...`
            : `Redirecting to home page automatically in ${countdown}s...`}
        </p>
      </div>
    </div>
  );
}
