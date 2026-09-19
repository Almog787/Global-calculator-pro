import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useI18n } from '../contexts/i18n';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const { lang } = useI18n();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const labels = {
    he: {
      offline: 'מצב אופליין — כל המחשבונים פועלים ללא אינטרנט',
      online: 'החיבור לאינטרנט חודש בהצלחה'
    },
    en: {
      offline: 'Offline Mode — All calculators work without internet',
      online: 'Back online — Connection restored'
    },
    es: {
      offline: 'Modo sin conexión — Todas las calculadoras funcionan offline',
      online: 'De nuevo en línea — Conexión restaurada'
    },
    fr: {
      offline: 'Mode hors ligne — Tous les calculateurs fonctionnent sans internet',
      online: 'De retour en ligne — Connexion rétablie'
    },
    ar: {
      offline: 'وضع عدم الاتصال — جميع الآلات الحاسبة تعمل بدون إنترنت',
      online: 'تمت استعادة الاتصال بالإنترنت'
    }
  }[lang] || {
    offline: 'Offline Mode — All calculators work without internet',
    online: 'Back online — Connection restored'
  };

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 rtl:left-auto rtl:right-4 z-40 flex items-center gap-2 rounded-2xl bg-amber-600/95 text-white px-3.5 py-2 text-xs font-semibold shadow-xl border border-amber-400/30 backdrop-blur-xs animate-bounce">
        <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
        <span>{labels.offline}</span>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-4 rtl:left-auto rtl:right-4 z-40 flex items-center gap-2 rounded-2xl bg-emerald-600/95 text-white px-3.5 py-2 text-xs font-semibold shadow-xl border border-emerald-400/30 backdrop-blur-xs animate-fade-in">
        <Wifi className="w-4 h-4 text-emerald-200 shrink-0" />
        <span>{labels.online}</span>
      </div>
    );
  }

  return null;
};
