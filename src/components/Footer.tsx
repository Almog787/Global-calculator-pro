import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/i18n';

export default function Footer() {
  const { t, lang } = useI18n();

  return (
    <footer className="bg-surface-container-low w-full py-8 md:py-12 px-4 md:px-margin-desktop mt-auto border-t border-border-subtle">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col gap-2">
          <Link to={`/${lang}`} className="font-headline-md text-headline-md font-bold text-primary hover:text-secondary transition-colors duration-200 cursor-pointer">
            {t.title}<span className="text-secondary">.</span>
          </Link>
          <p className="font-body-md text-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} GlobalCalc. {t.footerRights || 'High-performance precision tools for professionals.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end items-center">
          <Link to={`/${lang}/widgets`} className="font-body-md text-sm text-secondary hover:underline font-semibold transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">widgets</span>
            <span>{lang === 'he' ? 'ווידג\'טים להטמעה' : lang === 'es' ? 'Widgets Web' : lang === 'fr' ? 'Widgets d\'intégration' : lang === 'ar' ? 'أدوات التضمين' : 'Embed Widgets'}</span>
          </Link>
          <Link to={`/${lang}/about`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.aboutTitle || 'About Us'}
          </Link>
          <Link to={`/${lang}/terms-of-service`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.termsTitle || 'Terms of Service'}
          </Link>
          <Link to={`/${lang}/privacy-policy`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.privacyTitle || 'Privacy Policy'}
          </Link>
          <Link to={`/${lang}/contact`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.contactTitle || 'Contact Support'}
          </Link>
          <Link to={`/${lang}/suggest`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.suggestionsTitle || 'Request Calculator'}
          </Link>
        </div>
      </div>

      {/* Global Comprehensive Disclaimer */}
      <div className="max-w-container-max mx-auto mt-6 pt-6 border-t border-border-subtle/80 text-[11px] sm:text-xs text-on-surface-variant/80 leading-relaxed space-y-1.5">
        <p className="font-bold text-on-surface-variant">
          {lang === 'he'
            ? 'הבהרה משפטית, רפואית וכלכלית חשובה:'
            : lang === 'es'
            ? 'Aviso Legal, Médico y Financiero Importante:'
            : lang === 'fr'
            ? 'Avertissement Légal, Médical et Financier Important :'
            : lang === 'ar'
            ? 'إخلاء مسؤولية قانوني وطبي ومالي هام:'
            : 'Important Legal, Medical & Financial Disclaimer:'}
        </p>
        <p>
          {lang === 'he'
            ? 'כל המחשבונים, הנתונים, ההמרות והתכנים באתר GlobalCalc Pro נועדו לצורכי סימולציה, הערכה, לימוד והעשרה כללית בלבד. אין לראות בתוצאות החישובים בשום אופן ייעוץ רפואי, אבחנה קלינית, ייעוץ פיננסי, ייעוץ השקעות, ייעוץ משכנתאות, ייעוץ מס או ייעוץ משפטי, והם אינם יוצרים יחסי מומחה-לקוח. אין להסתמך על נתוני האתר לקבלת החלטות בריאותיות, כלכליות או משפטיות מבלי להיוועץ תחילה באיש מקצוע מוסמך ובעל רישיון מתאים (רופא מוסמך, יועץ השקעות, יועץ משכנתאות, יועץ מס או עורך דין). השימוש באתר ובתוצאותיו נעשה באחריותו המלאה והבלעדית של המשתמש.'
            : lang === 'es'
            ? 'Todas las calculadoras, conversiones y contenidos de GlobalCalc Pro tienen fines exclusivamente educativos y de estimación informativa. No constituyen en ningún caso asesoramiento médico, diagnóstico clínico, asesoramiento financiero, de inversión, hipotecario, fiscal ni legal. Consulte siempre a profesionales certificados antes de tomar cualquier decisión médica o financiera. El uso de este sitio web es bajo su propia y exclusiva responsabilidad.'
            : lang === 'fr'
            ? 'L\'ensemble des calculatrices et informations fournies sur GlobalCalc Pro sont uniquement destinées à des fins éducatives et indicatives. Elles ne constituent en aucun cas un avis médical, un diagnostic, un conseil en investissement, fiscal, hypothécaire ou juridique professionnel. Consultez toujours un professionnel qualifié et agréé avant toute décision. L\'utilisation du site s\'effectue sous votre seule responsabilité.'
            : lang === 'ar'
            ? 'جميع الحاسبات والمعلومات المقدمة على GlobalCalc Pro هي لأغراض تعليمية وإرشادية عامة فقط. ولا تشكل بأي حال من الأحوال استشارة طبية أو تشخيصاً علاجياً، أو استشارة مالية أو استثمارية أو عقارية أو ضريبية أو قانونية. يُرجى دائماً استشارة المتخصصين المؤهلين والمرخصين قبل اتخاذ أي قرارات صحية أو مالية أو قانونية. استخدام الموقع يقع على مسؤولية المستخدم الكاملة.'
            : 'All calculators, estimations, and content on GlobalCalc Pro are provided strictly for educational and informational simulation purposes. Nothing on this website constitutes medical advice, clinical diagnosis, financial, investment, mortgage, tax, or legal advice, nor does it create a professional-client relationship. Always consult licensed and certified professionals before making any health, financial, or legal decisions. Use of this website is at your sole discretion and risk.'}
        </p>
      </div>
    </footer>
  );
}
