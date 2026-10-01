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
            <span>{lang === 'he' ? 'ווידג\'טים להטמעה' : lang === 'es' ? 'Widgets Web' : lang === 'fr' ? 'Widgets d\'intégration' : lang === 'ar' ? 'أدوات التضمين' : lang === 'ru' ? 'Встраиваемые виджеты' : 'Embed Widgets'}</span>
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
          <a 
            href="https://github.com/Almog787/Global-calculator-pro" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors flex items-center gap-1.5"
            title="Star Global Calc Pro on GitHub"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub ⭐</span>
          </a>
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
            : lang === 'ru'
            ? 'Важное юридическое, медицинское и финансовое уведомление:'
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
            : lang === 'ru'
            ? 'Все калькуляторы, конвертеры и информационные материалы на сайте GlobalCalc Pro предназначены исключительно для ознакомительных, обучающих и ориентировочных расчетов. Они ни при каких обстоятельствах не являются медицинской диагностикой, финансовой, инвестиционной, налоговой или юридической консультацией. Перед принятием ответственных решений всегда консультируйтесь с квалифицированными профильными специалистами. Использование сервиса осуществляется под вашу личную ответственность.'
            : 'All calculators, estimations, and content on GlobalCalc Pro are provided strictly for educational and informational simulation purposes. Nothing on this website constitutes medical advice, clinical diagnosis, financial, investment, mortgage, tax, or legal advice, nor does it create a professional-client relationship. Always consult licensed and certified professionals before making any health, financial, or legal decisions. Use of this website is at your sole discretion and risk.'}
        </p>
      </div>
    </footer>
  );
}
