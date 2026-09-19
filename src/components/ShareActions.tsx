import React, { useState } from 'react';
import { Link as LinkIcon, Check, Clock, ChevronDown, Code, Printer, Share2, FileSpreadsheet } from 'lucide-react';
import { useI18n } from '../contexts/i18n';
import EmbedModal from './EmbedModal';

interface ShareActionsProps {
  onSaveHistory?: () => void;
  historyEntries?: Array<{ timestamp: number; state: any }>;
  onLoadHistory?: (index: number) => void;
  calculatorTitle?: string;
  calculatorPath?: string;
  shareMessage?: string;
  onExportExcel?: () => void;
}

export default function ShareActions({
  onSaveHistory,
  historyEntries = [],
  onLoadHistory,
  calculatorTitle,
  calculatorPath,
  shareMessage,
  onExportExcel,
}: ShareActionsProps) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const isRtl = t.dir === 'rtl';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = shareMessage
      ? `${shareMessage}\n\n${window.location.href}`
      : `${calculatorTitle || 'GlobalCalc Pro'}\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  const hasHistory = historyEntries && historyEntries.length > 0;

  const labels = {
    en: { copyLink: 'Copy Link', whatsapp: 'Share via WhatsApp', print: 'Print / Save PDF', excel: 'Export to Excel', embed: 'Embed Widget', saveResult: 'Save Result', history: 'Recent Calculations' },
    he: { copyLink: 'העתק קישור', whatsapp: 'שתף ב-WhatsApp', print: 'הדפס / שמור כ-PDF', excel: 'ייצוא ל-Excel', embed: 'הטמע באתר (Embed)', saveResult: 'שמור חישוב', history: 'היסטוריית חישובים' },
    es: { copyLink: 'Copiar Enlace', whatsapp: 'Compartir en WhatsApp', print: 'Imprimir / PDF', excel: 'Exportar a Excel', embed: 'Insertar Widget', saveResult: 'Guardar Resultado', history: 'Cálculos Recientes' },
    fr: { copyLink: 'Copier le Lien', whatsapp: 'Partager sur WhatsApp', print: 'Imprimer / PDF', excel: 'Exporter vers Excel', embed: 'Intégrer le Widget', saveResult: 'Sauvegarder', history: 'Historique des Calculs' },
    ar: { copyLink: 'نسخ الرابط', whatsapp: 'مشاركة عبر WhatsApp', print: 'طباعة / حفظ PDF', excel: 'تصدير إلى Excel', embed: 'تضمين في موقعك', saveResult: 'حفظ الحساب', history: 'سجل الحسابات' },
  }[lang] || { copyLink: 'Copy Link', whatsapp: 'Share via WhatsApp', print: 'Print / Save PDF', excel: 'Export to Excel', embed: 'Embed Widget', saveResult: 'Save Result', history: 'Recent Calculations' };

  return (
    <>
      <div className="mt-8 pt-6 border-t border-border-subtle flex flex-wrap items-center gap-2.5 justify-between sm:justify-start print:hidden">
        <div className="flex flex-wrap gap-2">
          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-lg transition-colors font-medium text-xs sm:text-sm border border-border-subtle cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4 text-on-surface-variant" />}
            <span>{labels.copyLink}</span>
          </button>

          {/* WhatsApp Share */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors font-medium text-xs sm:text-sm border border-emerald-200 cursor-pointer"
            title={labels.whatsapp}
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>{labels.whatsapp}</span>
          </button>

          {/* Excel Export */}
          {onExportExcel && (
            <button
              type="button"
              onClick={onExportExcel}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm shadow-xs cursor-pointer"
              title={labels.excel}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>{labels.excel}</span>
            </button>
          )}

          {/* Print / Save PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-lg transition-colors font-medium text-xs sm:text-sm border border-border-subtle cursor-pointer"
            title={labels.print}
          >
            <Printer className="w-4 h-4 text-on-surface-variant" />
            <span>{labels.print}</span>
          </button>

          {/* Embed Widget */}
          <button
            type="button"
            onClick={() => setIsEmbedModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-low hover:bg-blue-50 text-on-surface hover:text-blue-700 rounded-lg transition-colors font-medium text-xs sm:text-sm border border-border-subtle hover:border-blue-300 cursor-pointer"
          >
            <Code className="w-4 h-4 text-blue-600" />
            <span>{labels.embed}</span>
          </button>
        </div>

        {onSaveHistory && (
          <div className="relative">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  onSaveHistory();
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary hover:opacity-90 rounded-lg transition-opacity font-medium text-xs sm:text-sm shadow-xs"
              >
                <Clock className="w-4 h-4" />
                <span>{labels.saveResult}</span>
              </button>
              {hasHistory && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-2 py-2 bg-surface-container-low hover:bg-surface-container-high border border-border-subtle text-on-surface rounded-lg transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>

            {showHistory && hasHistory && onLoadHistory && (
              <div className={`absolute top-full mt-2 w-64 bg-surface-container-lowest border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden ${isRtl ? 'right-0' : 'left-0'}`}>
                <div className="px-4 py-3 bg-surface-container-low border-b border-border-subtle">
                  <h4 className="font-bold text-sm text-on-surface">{labels.history}</h4>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {historyEntries.map((entry, idx) => (
                    <button
                      key={entry.timestamp}
                      type="button"
                      onClick={() => {
                        onLoadHistory(idx);
                        setShowHistory(false);
                      }}
                      className="w-full text-start px-4 py-3 border-b border-border-subtle/50 hover:bg-surface-container-low transition-colors text-sm text-on-surface-variant last:border-0"
                    >
                      {new Date(entry.timestamp).toLocaleString(lang === 'he' ? 'he-IL' : 'en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        calculatorTitle={calculatorTitle}
        calculatorPath={calculatorPath}
      />
    </>
  );
}
