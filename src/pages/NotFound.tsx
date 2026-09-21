import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/i18n';
import SEO from '../components/SEO';
import SearchBar from '../components/SearchBar';
import Squares from '../components/Squares';
import { motion } from 'framer-motion';

export default function NotFound() {
  const { t, lang } = useI18n();
  const isRtl = t.dir === 'rtl';

  const localizedContent = {
    he: {
      title: 'הדף שחיפשת לא נמצא',
      subtitle: 'אבל אל דאגה! מנוע החישובים שלנו מלא במחשבונים מקצועיים שיעזרו לך למצוא בדיוק את מה שאתה צריך.',
      searchPlaceholder: 'חפש מחשבון משכנתא, שכר נטו, אופציות, המרת מט"ח...',
      popularTitle: 'מחשבונים פופולריים שיכולים לעזור:',
      backHome: 'חזרה לדף הבית',
      suggestCalc: 'הצע מחשבון חדש',
    },
    en: {
      title: 'Page Not Found',
      subtitle: "Don't worry! Our calculation platform is packed with professional calculators to help you find exactly what you need.",
      searchPlaceholder: 'Search for mortgage, salary, stock options, currency...',
      popularTitle: 'Popular Calculators You Might Like:',
      backHome: 'Back to Home',
      suggestCalc: 'Suggest a Calculator',
    },
    es: {
      title: 'Página no encontrada',
      subtitle: '¡No te preocupes! Nuestra plataforma tiene calculadoras profesionales para ayudarte a encontrar exactamente lo que necesitas.',
      searchPlaceholder: 'Buscar hipoteca, salario, opciones de acciones, divisas...',
      popularTitle: 'Calculadoras populares que te pueden interesar:',
      backHome: 'Volver al Inicio',
      suggestCalc: 'Sugerir Calculadora',
    },
    fr: {
      title: 'Page non trouvée',
      subtitle: 'Ne vous inquiétez pas ! Notre plateforme contient des calculatrices professionnelles pour vous aider.',
      searchPlaceholder: 'Rechercher prêt immobilier, salaire, stock-options, devises...',
      popularTitle: 'Calculatrices populaires :',
      backHome: 'Retour à l\'accueil',
      suggestCalc: 'Suggérer une calculatrice',
    },
    ar: {
      title: 'الصفحة غير موجودة',
      subtitle: 'لا تقلق! منصة الحسابات لدينا مليئة بالحاسبات الاحترافية لمساعدتك في العثور على ما تحتاجه.',
      searchPlaceholder: 'ابحث عن حاسبة الرهن العقاري، الراتب الصافي، الأسهم...',
      popularTitle: 'حاسبات شائعة قد تهمك:',
      backHome: 'العودة للصفحة الرئيسية',
      suggestCalc: 'اقترح حاسبة جديدة',
    },
  };

  const text = localizedContent[lang as keyof typeof localizedContent] || localizedContent.en;

  const quickLinks = [
    {
      title: isRtl ? 'מחשבון משכנתא' : 'Mortgage Calculator',
      desc: isRtl ? 'חישוב החזר חודשי, לוח סילוקין ושפיצר' : 'Calculate monthly payment & amortization',
      icon: 'real_estate_agent',
      path: `/${lang}/mortgage-calculator`,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: isRtl ? 'מחשבון שכר נטו' : 'Salary Calculator',
      desc: isRtl ? 'חישוב ברוטו לנטו, מס הכנסה וביטוח לאומי' : 'Calculate gross to net salary & income tax',
      icon: 'payments',
      path: `/${lang}/salary-calculator`,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: isRtl ? 'שווי אופציות ו-RSU' : 'Stock Options & RSU',
      desc: isRtl ? 'חישוב מס סעיף 102, הבשלה ותרחישי אקזיט' : 'Vesting schedule & Section 102 capital gains',
      icon: 'show_chart',
      path: `/${lang}/calculators/stock-options-rsu`,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20',
    },
    {
      title: isRtl ? 'מחשבון ריבית דריבית' : 'Compound Interest',
      desc: isRtl ? 'חישוב צמיחת חיסכון והשקעות לטווח ארוך' : 'Calculate long-term investment growth',
      icon: 'trending_up',
      path: `/${lang}/compound-interest`,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: isRtl ? 'המרת מט"ח בזמן אמת' : 'Currency Converter',
      desc: isRtl ? 'דולר, יורו, שקל ושערי חליפין רציפים' : 'Real-time exchange rates for USD, EUR, ILS',
      icon: 'currency_exchange',
      path: `/${lang}/calculators/currency-converter`,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: isRtl ? 'כל 36+ המחשבונים' : 'All 36+ Calculators',
      desc: isRtl ? 'עיון בקטלוג המלא לפי קטגוריות' : 'Browse full library by categories',
      icon: 'grid_view',
      path: `/${lang}/all`,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <>
      <SEO 
        title={`404 - ${text.title}`} 
        description={text.subtitle} 
        noindex={true} 
      />

      <div id="not-found-page" className="max-w-5xl mx-auto py-8 sm:py-12 px-4">
        {/* Main 404 Hero Showcase Card */}
        <section className="relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-border-subtle/80 p-8 sm:p-12 shadow-xl text-center mb-10">
          <Squares 
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(0, 107, 91, 0.06)"
            hoverFillColor="rgba(0, 107, 91, 0.12)"
            squareSize={48}
          />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            {/* Visual 3D Badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-20 h-20 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 shadow-lg backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-4xl">search_off</span>
            </motion.div>

            {/* Big 404 Code */}
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl sm:text-7xl font-black text-primary-container tracking-tight mb-2 font-display-xl"
            >
              404
            </motion.h1>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3 tracking-tight">
              {text.title}
            </h2>

            <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              {text.subtitle}
            </p>

            {/* Embedded Live Search Engine */}
            <div className="w-full max-w-lg mb-8">
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white dark:border-neutral-700 p-2 rounded-2xl shadow-xl">
                <SearchBar placeholder={text.searchPlaceholder} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/${lang}/all`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-on-secondary font-bold text-sm rounded-xl shadow-md hover:bg-on-secondary-container transition-all active:scale-95 border border-[#005144]"
              >
                <span className="material-symbols-outlined text-lg">home</span>
                <span>{text.backHome}</span>
              </Link>

              <Link
                to={`/${lang}/suggest`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-sm rounded-xl border border-border-subtle/80 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg text-teal-600">add_circle</span>
                <span>{text.suggestCalc}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Links Matrix */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">auto_awesome</span>
            <span>{text.popularTitle}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group bg-surface-container-lowest border border-border-subtle/80 hover:border-teal-500/50 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-start gap-4"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${item.color}`}>
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    <span className="truncate">{item.title}</span>
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                      {isRtl ? 'arrow_back' : 'arrow_forward'}
                    </span>
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mt-1">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
