import React, { useState } from 'react';
import { Printer, Link as LinkIcon, Check, Clock, ChevronDown } from 'lucide-react';
import { useI18n } from '../contexts/i18n';

interface ShareActionsProps {
  onSaveHistory?: () => void;
  historyEntries?: Array<{ timestamp: number; state: any }>;
  onLoadHistory?: (index: number) => void;
}

export default function ShareActions({ onSaveHistory, historyEntries = [], onLoadHistory }: ShareActionsProps) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const isRtl = t.dir === 'rtl';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const hasHistory = historyEntries && historyEntries.length > 0;

  return (
    <div className="mt-8 pt-6 border-t border-border-subtle flex flex-wrap items-center gap-3 justify-between sm:justify-start">
      <div className="flex gap-2">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-lg transition-colors font-medium text-sm border border-border-subtle"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4 text-on-surface-variant" />}
          <span className="hidden sm:inline">{lang === 'he' ? 'העתק קישור' : 'Copy Link'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-lg transition-colors font-medium text-sm border border-border-subtle"
        >
          <Printer className="w-4 h-4 text-on-surface-variant" />
          <span className="hidden sm:inline">{lang === 'he' ? 'הדפס / PDF' : 'Print / PDF'}</span>
        </button>
      </div>

      {onSaveHistory && (
        <div className="relative">
          <div className="flex gap-1">
            <button
              onClick={() => {
                onSaveHistory();
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary hover:opacity-90 rounded-lg transition-opacity font-medium text-sm shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span>{lang === 'he' ? 'שמור חישוב' : 'Save Result'}</span>
            </button>
            {hasHistory && (
              <button
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
                <h4 className="font-bold text-sm text-on-surface">{lang === 'he' ? 'היסטוריית חישובים' : 'Recent Calculations'}</h4>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {historyEntries.map((entry, idx) => (
                  <button
                    key={entry.timestamp}
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
  );
}
