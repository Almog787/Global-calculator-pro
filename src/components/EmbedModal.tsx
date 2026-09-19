import React, { useState } from 'react';
import { useI18n } from '../contexts/i18n';
import { X, Copy, Check, Eye, Code2, ExternalLink } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorTitle?: string;
  calculatorPath?: string;
}

export default function EmbedModal({
  isOpen,
  onClose,
  calculatorTitle,
  calculatorPath
}: EmbedModalProps) {
  const { lang, t } = useI18n();
  const [widthType, setWidthType] = useState<'responsive' | 'fixed'>('responsive');
  const [fixedWidth, setFixedWidth] = useState(600);
  const [height, setHeight] = useState(650);
  const [includeBacklink, setIncludeBacklink] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPath = calculatorPath || window.location.pathname;
  // Ensure path starts without double slash
  const cleanPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  // Extract path without existing language prefix if any
  const pathWithoutLang = cleanPath.replace(/^\/(en|he|es|fr|ar)(\/|$)/, '/');
  const fullEmbedUrl = `https://globalcalcpro.com/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}?embed=true`;
  const canonicalUrl = `https://globalcalcpro.com/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;

  const widthValue = widthType === 'responsive' ? '100%' : `${fixedWidth}px`;
  const titleText = calculatorTitle || t.title || 'Calculator';

  const embedCode = `<iframe src="${fullEmbedUrl}" width="${widthValue}" height="${height}" frameborder="0" style="border: 1px solid #e5e7eb; border-radius: 12px; width: ${widthValue}; max-width: 100%;" title="${titleText}"></iframe>${
    includeBacklink
      ? `\n<p style="font-size: 12px; color: #6b7280; margin-top: 6px; text-align: center; font-family: sans-serif;">Powered by <a href="${canonicalUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">GlobalCalc Pro</a></p>`
      : ''
  }`;

  const translations = {
    en: {
      modalTitle: 'Embed Calculator on Your Website',
      modalSubtitle: 'Copy and paste the embed code into your website or blog.',
      tabCode: 'Embed Code',
      tabPreview: 'Live Preview',
      widthLabel: 'Width',
      responsiveWidth: 'Responsive (100%)',
      fixedWidthLabel: 'Fixed Width',
      heightLabel: 'Height (px)',
      backlinkLabel: 'Include free attribution link (Recommended for SEO)',
      copyCodeBtn: 'Copy HTML Code',
      copiedBtn: 'Copied to Clipboard!',
      previewNotice: 'Interactive preview of how this calculator will appear on your website:',
      openInNewTab: 'Open in new tab',
      close: 'Close',
    },
    he: {
      modalTitle: 'הטמעת המחשבון באתר שלך',
      modalSubtitle: 'העתק והדבק את קוד ה-HTML באתר, בבלוג או במערכת ה-CMS שלך.',
      tabCode: 'קוד הטמעה (HTML)',
      tabPreview: 'תצוגה מקדימה',
      widthLabel: 'רוחב הווידג\'ט',
      responsiveWidth: 'רספונסיבי מלא (100%)',
      fixedWidthLabel: 'רוחב קבוע',
      heightLabel: 'גובה (פיקסלים)',
      backlinkLabel: 'כלול קישור קרדיט ל-GlobalCalc Pro (מומלץ)',
      copyCodeBtn: 'העתק קוד HTML',
      copiedBtn: 'הקוד הועתק בהצלחה!',
      previewNotice: 'תצוגה מקדימה אינטראקטיבית של המחשבון כפי שיופיע באתר שלך:',
      openInNewTab: 'פתח בלשונית חדשה',
      close: 'סגור',
    },
    es: {
      modalTitle: 'Insertar Calculadora en tu Sitio Web',
      modalSubtitle: 'Copia y pega el código HTML en tu página o blog.',
      tabCode: 'Código de Inserción',
      tabPreview: 'Vista Previa',
      widthLabel: 'Ancho',
      responsiveWidth: 'Adaptable (100%)',
      fixedWidthLabel: 'Ancho Fijo',
      heightLabel: 'Altura (px)',
      backlinkLabel: 'Incluir enlace de atribución (Recomendado)',
      copyCodeBtn: 'Copiar Código HTML',
      copiedBtn: '¡Copiado al Portapapeles!',
      previewNotice: 'Vista previa de cómo se verá la calculadora en tu web:',
      openInNewTab: 'Abrir en nueva pestaña',
      close: 'Cerrar',
    },
    fr: {
      modalTitle: 'Intégrer la Calculatrice sur Votre Site',
      modalSubtitle: 'Copiez et collez le code d\'intégration sur votre site ou blog.',
      tabCode: 'Code d\'Intégration',
      tabPreview: 'Aperçu Direct',
      widthLabel: 'Largeur',
      responsiveWidth: 'Responsive (100%)',
      fixedWidthLabel: 'Largeur Fixe',
      heightLabel: 'Hauteur (px)',
      backlinkLabel: 'Inclure le lien d\'attribution (Recommandé)',
      copyCodeBtn: 'Copier le Code HTML',
      copiedBtn: 'Copié dans le Presse-papier !',
      previewNotice: 'Aperçu interactif de la calculatrice intégrée sur votre site :',
      openInNewTab: 'Ouvrir dans un nouvel onglet',
      close: 'Fermer',
    },
    ar: {
      modalTitle: 'تضمين الآلة الحاسبة في موقعك',
      modalSubtitle: 'انسخ كود HTML والصقه في موقعك أو مدونتك.',
      tabCode: 'كود التضمين (HTML)',
      tabPreview: 'معاينة مباشرة',
      widthLabel: 'العرض',
      responsiveWidth: 'متجاوب (100%)',
      fixedWidthLabel: 'عرض ثابت',
      heightLabel: 'الارتفاع (بكسل)',
      backlinkLabel: 'تضمين رابط الإسناد المجاني (موصى به)',
      copyCodeBtn: 'نسخ كود HTML',
      copiedBtn: 'تم النسخ بنجاح!',
      previewNotice: 'معاينة تفاعلية لكيفية ظهور الآلة الحاسبة على موقعك:',
      openInNewTab: 'فتح في علامة تبويب جديدة',
      close: 'إغلاق',
    },
  }[lang] || {
    modalTitle: 'Embed Calculator on Your Website',
    modalSubtitle: 'Copy and paste the embed code into your website or blog.',
    tabCode: 'Embed Code',
    tabPreview: 'Live Preview',
    widthLabel: 'Width',
    responsiveWidth: 'Responsive (100%)',
    fixedWidthLabel: 'Fixed Width',
    heightLabel: 'Height (px)',
    backlinkLabel: 'Include free attribution link (Recommended for SEO)',
    copyCodeBtn: 'Copy HTML Code',
    copiedBtn: 'Copied to Clipboard!',
    previewNotice: 'Interactive preview of how this calculator will appear on your website:',
    openInNewTab: 'Open in new tab',
    close: 'Close',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
              <Code2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                {translations.modalTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {translations.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label={translations.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 bg-white">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'code'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            {translations.tabCode}
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            {translations.tabPreview}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Customization Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm">
            {/* Width Selection */}
            <div>
              <label className="font-bold text-stone-700 block mb-1.5">
                {translations.widthLabel}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWidthType('responsive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    widthType === 'responsive'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {translations.responsiveWidth}
                </button>
                <button
                  type="button"
                  onClick={() => setWidthType('fixed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    widthType === 'fixed'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {translations.fixedWidthLabel}
                </button>
              </div>
              {widthType === 'fixed' && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="range"
                    min="350"
                    max="900"
                    step="50"
                    value={fixedWidth}
                    onChange={(e) => setFixedWidth(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <span className="font-mono text-xs text-stone-600 whitespace-nowrap">{fixedWidth}px</span>
                </div>
              )}
            </div>

            {/* Height Selection */}
            <div>
              <label className="font-bold text-stone-700 block mb-1.5">
                {translations.heightLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="450"
                  max="950"
                  step="50"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="font-mono text-xs text-stone-600 whitespace-nowrap">{height}px</span>
              </div>
            </div>

            {/* Backlink Toggle */}
            <div className="sm:col-span-2 pt-2 border-t border-stone-200">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeBacklink}
                  onChange={(e) => setIncludeBacklink(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-stone-300"
                />
                <span className="text-stone-700 font-medium text-xs sm:text-sm">
                  {translations.backlinkLabel}
                </span>
              </label>
            </div>
          </div>

          {/* Tab 1: Code */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="relative">
                <pre 
                  dir="ltr"
                  className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap break-all max-h-48 border border-stone-800 selection:bg-blue-600"
                >
                  {embedCode}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <a
                  href={fullEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {translations.openInNewTab}
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-98'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? translations.copiedBtn : translations.copyCodeBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Live Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500">
                {translations.previewNotice}
              </p>
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex justify-center overflow-x-auto">
                <div 
                  style={{ width: widthValue, maxWidth: '100%' }}
                  className="rounded-xl overflow-hidden shadow-sm border border-stone-300 bg-white"
                >
                  <iframe
                    src={fullEmbedUrl}
                    width="100%"
                    height={Math.min(height, 500)}
                    title="Calculator Preview"
                    className="border-0 w-full"
                  />
                  {includeBacklink && (
                    <div className="p-2 text-center text-[11px] text-stone-500 bg-stone-50 border-t border-stone-200">
                      Powered by <span className="text-blue-600 font-semibold underline">GlobalCalc Pro</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
