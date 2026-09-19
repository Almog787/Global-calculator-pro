import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../contexts/HistoryContext';
import { useI18n } from '../contexts/i18n';
import {
  History,
  X,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';

function formatRelativeTime(
  timestamp: number,
  now: number,
  t: { justNow: string; minsAgo: string; hoursAgo: string; daysAgo: string }
) {
  const diffMs = Math.max(0, now - timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return t.justNow;
  if (diffMin < 60) return t.minsAgo.replace('{m}', String(diffMin));
  if (diffHours < 24) return t.hoursAgo.replace('{h}', String(diffHours));
  return t.daysAgo.replace('{d}', String(diffDays));
}

export default function HistoryDrawer() {
  const { history, isDrawerOpen, closeDrawer, deleteCalculation, clearAllCalculations } = useHistory();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [renderedAt] = useState(() => Date.now());

  if (!isDrawerOpen) return null;

  const isRtl = lang === 'he' || lang === 'ar';

  const t = {
    he: {
      title: 'היסטוריית חישובים אישית',
      subtitle: 'נשמר מקומית בדפדפן שלך בלבד',
      clearAll: 'נקה הכל',
      clearConfirm: 'האם למחוק את כל היסטוריית החישובים?',
      emptyTitle: 'אין חישובים שמורים עדיין',
      emptyDesc: 'כל חישוב שתבצע במחשבונים השונים יישמר כאן באופן אוטומטי, כך שתוכל לחזור אליו בכל עת.',
      startCalculating: 'גלה מחשבונים',
      loadCalc: 'טען חישוב זה',
      copied: 'הועתק ללוח!',
      copySummary: 'העתק סיכום',
      delete: 'מחק',
      recentBadge: 'אחרון',
      justNow: 'הרגע',
      minsAgo: 'לפני {m} דקות',
      hoursAgo: 'לפני {h} שעות',
      daysAgo: 'לפני {d} ימים',
    },
    en: {
      title: 'Recent Calculations History',
      subtitle: 'Stored privately on your device',
      clearAll: 'Clear All',
      clearConfirm: 'Delete all saved calculation history?',
      emptyTitle: 'No saved calculations yet',
      emptyDesc: 'Calculations you perform across our suite are automatically saved here so you can revisit them anytime.',
      startCalculating: 'Explore Tools',
      loadCalc: 'Load & Recalculate',
      copied: 'Copied to clipboard!',
      copySummary: 'Copy summary',
      delete: 'Delete',
      recentBadge: 'Latest',
      justNow: 'Just now',
      minsAgo: '{m}m ago',
      hoursAgo: '{h}h ago',
      daysAgo: '{d}d ago',
    },
    es: {
      title: 'Historial de Cálculos Recientes',
      subtitle: 'Guardado localmente en tu dispositivo',
      clearAll: 'Borrar Todo',
      clearConfirm: '¿Eliminar todo el historial guardado?',
      emptyTitle: 'No hay cálculos guardados todavía',
      emptyDesc: 'Los cálculos que realices se guardarán automáticamente aquí para que puedas retomarlos en cualquier momento.',
      startCalculating: 'Explorar Calculadoras',
      loadCalc: 'Cargar Cálculo',
      copied: '¡Copiado!',
      copySummary: 'Copiar resumen',
      delete: 'Eliminar',
      recentBadge: 'Último',
      justNow: 'Ahora mismo',
      minsAgo: 'hace {m}m',
      hoursAgo: 'hace {h}h',
      daysAgo: 'hace {d}d',
    },
    fr: {
      title: 'Historique des Calculs Récents',
      subtitle: 'Enregistré localement sur votre appareil',
      clearAll: 'Tout Effacer',
      clearConfirm: 'Supprimer tout l\'historique ?',
      emptyTitle: 'Aucun calcul enregistré',
      emptyDesc: 'Vos calculs sont automatiquement mémorisés ici pour que vous puissiez y revenir à tout moment.',
      startCalculating: 'Découvrir les Outils',
      loadCalc: 'Recharger le calcul',
      copied: 'Copié !',
      copySummary: 'Copier le résumé',
      delete: 'Supprimer',
      recentBadge: 'Dernier',
      justNow: 'À l\'instant',
      minsAgo: 'il y a {m} min',
      hoursAgo: 'il y a {h} h',
      daysAgo: 'il y a {d} j',
    },
    ar: {
      title: 'سجل الحسابات الأخيرة',
      subtitle: 'محفوظ محلياً على جهازك فقط',
      clearAll: 'مسح الكل',
      clearConfirm: 'هل تريد حذف جميع الحسابات المحفوظة؟',
      emptyTitle: 'لا توجد حسابات محفوظة بعد',
      emptyDesc: 'يتم حفظ جميع حساباتك تلقائياً هنا لتتمكن من الرجوع إليها ومقارنتها في أي وقت.',
      startCalculating: 'استكشف الحاسبات',
      loadCalc: 'استرجاع الحساب',
      copied: 'تم النسخ!',
      copySummary: 'نسخ الملخص',
      delete: 'حذف',
      recentBadge: 'الأحدث',
      justNow: 'الآن',
      minsAgo: 'منذ {m} دقيقة',
      hoursAgo: 'منذ {h} ساعة',
      daysAgo: 'منذ {d} يوم',
    },
  }[lang] || {
    title: 'Recent Calculations History',
    subtitle: 'Stored privately on your device',
    clearAll: 'Clear All',
    clearConfirm: 'Delete all saved calculation history?',
    emptyTitle: 'No saved calculations yet',
    emptyDesc: 'Calculations you perform across our suite are automatically saved here so you can revisit them anytime.',
    startCalculating: 'Explore Tools',
    loadCalc: 'Load & Recalculate',
    copied: 'Copied to clipboard!',
    copySummary: 'Copy summary',
    delete: 'Delete',
    recentBadge: 'Latest',
    justNow: 'Just now',
    minsAgo: '{m}m ago',
    hoursAgo: '{h}h ago',
    daysAgo: '{d}d ago',
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLoad = (path: string) => {
    closeDrawer();
    // Path includes localized prefix or relative params
    const targetUrl = path.startsWith('/') ? path : `/${lang}/${path}`;
    navigate(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex pl-0 sm:pl-10`}>
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl border-l border-border-subtle flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                  <span>{t.title}</span>
                  {history.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold">
                      {history.length}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-on-surface-variant">{t.subtitle}</p>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <RotateCcw className="w-8 h-8 opacity-40 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-on-surface mb-1">{t.emptyTitle}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs">{t.emptyDesc}</p>
                </div>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate(`/${lang}/all`);
                  }}
                  className="mt-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.startCalculating}</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    {lang === 'he' ? 'חישובים אחרונים' : 'Recent Calculations'}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(t.clearConfirm)) {
                        clearAllCalculations();
                      }
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.clearAll}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {history.map((item, index) => {
                    const titleText = item.title[lang as keyof typeof item.title] || item.title.en;
                    const summaryText = item.summary[lang as keyof typeof item.summary] || item.summary.en;
                    const resultText = item.result[lang as keyof typeof item.result] || item.result.en;
                    const fullSummaryToCopy = `${titleText}: ${summaryText} → ${resultText} (GlobalCalc Pro)`;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          index === 0
                            ? 'border-primary/30 bg-primary/5 shadow-xs'
                            : 'border-border-subtle bg-surface hover:border-border hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-on-surface">{titleText}</span>
                            {index === 0 && (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-600 text-white uppercase tracking-wider">
                                {t.recentBadge}
                              </span>
                            )}
                            {item.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-on-surface-variant shrink-0 font-medium">
                            {formatRelativeTime(item.timestamp, renderedAt, t)}
                          </span>
                        </div>

                        {/* Input Parameters Summary */}
                        <p className="text-xs text-on-surface-variant mb-2 leading-relaxed font-medium">
                          {summaryText}
                        </p>

                        {/* Key Output Result */}
                        <div className="p-2.5 rounded-xl bg-surface-container-low border border-border-subtle mb-3 flex items-center justify-between">
                          <span className="text-xs font-bold text-on-surface">{resultText}</span>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-border-subtle/50 text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleLoad(item.path)}
                              className="font-bold text-primary hover:text-primary-container flex items-center gap-1 cursor-pointer transition-colors py-1"
                              title={t.loadCalc}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>{t.loadCalc}</span>
                            </button>
                            <button
                              onClick={() => handleCopy(item.id, fullSummaryToCopy)}
                              className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 cursor-pointer transition-colors px-2 py-1"
                              title={t.copySummary}
                            >
                              {copiedId === item.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600 font-bold">{t.copied}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{t.copySummary}</span>
                                </>
                              )}
                            </button>
                          </div>

                          <button
                            onClick={() => deleteCalculation(item.id)}
                            className="text-on-surface-variant hover:text-red-600 transition-colors p-1 rounded-md cursor-pointer"
                            aria-label={t.delete}
                            title={t.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-border-subtle bg-surface-container-low flex justify-between items-center text-xs text-on-surface-variant">
              <span>{history.length} {lang === 'he' ? 'חישובים שמורים' : 'calculations saved'}</span>
              <button
                onClick={closeDrawer}
                className="font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
              >
                {lang === 'he' ? 'סגור' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
