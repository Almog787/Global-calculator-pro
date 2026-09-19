import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useI18n } from '../contexts/i18n';
import { trackPWAEvent } from '../lib/analytics';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { lang } = useI18n();

  if (isInstalled) {
    return null;
  }

  const labels = {
    he: {
      install: 'התקן אפליקציה',
      installIOS: 'התקן ב-iPhone',
      iosTitle: 'התקנה ב-iPhone / iPad',
      iosStep1: '1. לחץ על כפתור השיתוף (Share) בדפדפן Safari.',
      iosStep2: '2. גלול ובחר "הוסף למסך הבית" (Add to Home Screen).',
      close: 'סגור'
    },
    en: {
      install: 'Install App',
      installIOS: 'Install on iOS',
      iosTitle: 'Install on iPhone / iPad',
      iosStep1: '1. Tap the Share button in Safari.',
      iosStep2: '2. Scroll down and select "Add to Home Screen".',
      close: 'Close'
    },
    es: {
      install: 'Instalar App',
      installIOS: 'Instalar en iOS',
      iosTitle: 'Instalar en iPhone / iPad',
      iosStep1: '1. Toca el botón Compartir en Safari.',
      iosStep2: '2. Selecciona "Añadir a la pantalla de inicio".',
      close: 'Cerrar'
    },
    fr: {
      install: 'Installer l\'App',
      installIOS: 'Installer sur iOS',
      iosTitle: 'Installer sur iPhone / iPad',
      iosStep1: '1. Appuyez sur le bouton Partager dans Safari.',
      iosStep2: '2. Sélectionnez "Sur l\'écran d\'accueil".',
      close: 'Fermer'
    },
    ar: {
      install: 'تثبيت التطبيق',
      installIOS: 'تثبيت على iOS',
      iosTitle: 'التثبيت على iPhone / iPad',
      iosStep1: '1. اضغط على زر المشاركة (Share) في Safari.',
      iosStep2: '2. اختر "إضافة إلى الشاشة الرئيسية".',
      close: 'إغلاق'
    }
  }[lang] || {
    install: 'Install App',
    installIOS: 'Install on iOS',
    iosTitle: 'Install on iPhone / iPad',
    iosStep1: '1. Tap the Share button in Safari.',
    iosStep2: '2. Scroll down and select "Add to Home Screen".',
    close: 'Close'
  };

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => {
          trackPWAEvent('install_click');
          install();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        title={labels.install}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{labels.install}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            trackPWAEvent('ios_guide_viewed');
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-high border border-border-subtle text-on-surface rounded-xl text-xs font-medium transition-colors cursor-pointer"
          title={labels.installIOS}
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">{labels.installIOS}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-border-subtle text-on-surface">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  {labels.iosTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>{labels.iosStep1}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>{labels.iosStep2}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-on-primary hover:opacity-95 transition-opacity"
              >
                {labels.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
