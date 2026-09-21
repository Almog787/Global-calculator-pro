import { useEffect } from 'react';
import { useUrlState } from '../hooks/useUrlState';
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { calculators, getCalculatorTitle, getCalculatorDescription } from "../data/calculators";
import SEO from "../components/SEO";
import SearchBar from "../components/SearchBar";
import CountUp from "../components/CountUp";
import SpotlightCard from "../components/SpotlightCard";
import Magnet from "../components/Magnet";
import Squares from "../components/Squares";
import RotatingText from "../components/RotatingText";
import { useI18n } from "../contexts/i18n";

export default function AllCalculators() {
  const { t, lang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useUrlState<string>('activeCategory', "all");
  const { categoryId } = useParams<{ categoryId: string }>();

  // Interactive Mortgage Mini-Card State in Bento Grid
  const [mortgageAmount, setMortgageAmount] = useUrlState<number>('mortgageAmount', 1200000);
  const [mortgageRate, setMortgageRate] = useUrlState<number>('mortgageRate', 4.5);
  const mortgageYears = 25;

  // Interactive 3D Glassmorphism Parallax Motion Values (Proposal 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const card1X = useTransform(mouseXSpring, [-0.5, 0.5], [-22, 22]);
  const card1Y = useTransform(mouseYSpring, [-0.5, 0.5], [-16, 16]);

  const card2X = useTransform(mouseXSpring, [-0.5, 0.5], [24, -24]);
  const card2Y = useTransform(mouseYSpring, [-0.5, 0.5], [18, -18]);

  const card3X = useTransform(mouseXSpring, [-0.5, 0.5], [-14, 14]);
  const card3Y = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Compute live monthly payment estimate
  const monthlyRate = mortgageRate / 100 / 12;
  const totalMonths = mortgageYears * 12;
  const estimatedMonthly = Math.round(
    monthlyRate > 0
      ? (mortgageAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : mortgageAmount / totalMonths
  );

  // PWA Promo State
  const [isPwaPromoCollapsed, setIsPwaPromoCollapsed] = useUrlState('isPwaPromoCollapsed', false);

  useEffect(() => {
    const hiddenUntil = localStorage.getItem("pwaPromoHiddenUntil");
    if (hiddenUntil && parseInt(hiddenUntil, 10) > Date.now()) {
      setIsPwaPromoCollapsed(true);
    }
  }, []);

  const handleCollapsePwa = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPwaPromoCollapsed(true);
    localStorage.setItem("pwaPromoHiddenUntil", (Date.now() + 24 * 60 * 60 * 1000).toString());
  };

  const handleExpandPwa = () => {
    setIsPwaPromoCollapsed(false);
    localStorage.setItem("pwaPromoHiddenUntil", "0");
  };

  useEffect(() => {
    if (categoryId) {
      setActiveCategory(categoryId);
    } else {
      const params = new URLSearchParams(location.search);
      const queryCategory = params.get("category");
      if (queryCategory) {
        setActiveCategory(queryCategory);
      } else {
        setActiveCategory("all");
      }
    }
  }, [categoryId, location.search]);

  const categories = [
    { id: "all", label: t.catAll },
    { id: "finance", label: t.catFinance },
    { id: "real-estate", label: t.catRealEstate },
    { id: "health", label: t.catHealth },
    { id: "math", label: t.catMath },
    { id: "tech", label: t.catTech },
    { id: "lifestyle", label: t.catLifestyle },
  ];

  const filtered =
    activeCategory === "all"
      ? calculators
      : calculators.filter((c) => c.category === activeCategory);

  const isRtl = t.dir === 'rtl';

  // Localized texts for Bento Showcase
  const bentoTexts = {
    he: {
      heroTitle: 'כל מחשבון שתצטרך, במקום אחד',
      heroSubtitle: 'כלי חישוב מקצועיים, מדויקים ואמינים לכל מטרה. מפיננסים ועד בריאות - התשובות שלך מחכות כאן.',
      heroSearchPlaceholder: 'איזה חישוב תרצה לבצע היום?',
      assistantTooltip: 'Calc-E העוזר',
      finBadge: 'פיננסים ומשכנתאות',
      finTitle: 'מחשבון משכנתא מתקדם',
      loanAmountLabel: 'סכום הלוואה',
      interestLabel: 'ריבית שנתית (%)',
      monthlyEstLabel: 'החזר חודשי משוער',
      healthBadge: 'בריאות',
      healthTitle: 'מדד BMI',
      healthStatus: 'תקין',
      bmiBtn: 'חשב מדד BMI',
      realEstateBadge: 'נדל"ן',
      realEstateTitle: 'תשואת שכר דירה',
      realEstateDesc: 'חשב במהירות את התשואה השנתית על הנכס שלך בהתבסס על מחיר הקנייה והשכירות החודשית.',
      realEstateBtn: 'חשב תשואה',
      mathBadge: 'מתמטיקה והמרות',
      mathTitle: 'המרת יחידות מהירה',
      weight: 'משקל',
      distance: 'מרחק',
      temp: 'טמפרטורה',
      moreConversions: 'עוד המרות...'
    },
    en: {
      heroTitle: 'Every Calculator You Need, In One Place',
      heroSubtitle: 'High-performance, accurate, and reliable calculation tools for any purpose. From finance to health — your answers are here.',
      heroSearchPlaceholder: 'What calculation would you like to perform today?',
      assistantTooltip: 'Calc-E Assistant',
      finBadge: 'Finance & Mortgages',
      finTitle: 'Advanced Mortgage Calculator',
      loanAmountLabel: 'Loan Amount',
      interestLabel: 'Annual Interest (%)',
      monthlyEstLabel: 'Est. Monthly Payment',
      healthBadge: 'Health',
      healthTitle: 'BMI Index',
      healthStatus: 'Normal',
      bmiBtn: 'Calculate BMI',
      realEstateBadge: 'Real Estate',
      realEstateTitle: 'Rental Yield',
      realEstateDesc: 'Quickly calculate the annual return on your investment property based on purchase price and monthly rent.',
      realEstateBtn: 'Calculate Yield',
      mathBadge: 'Math & Conversions',
      mathTitle: 'Quick Unit Converter',
      weight: 'Weight',
      distance: 'Distance',
      temp: 'Temperature',
      moreConversions: 'More Conversions...'
    },
    es: {
      heroTitle: 'Cada calculadora que necesites, en un solo lugar',
      heroSubtitle: 'Herramientas de cálculo profesionales, precisas y confiables para cualquier propósito.',
      heroSearchPlaceholder: '¿Qué cálculo deseas realizar hoy?',
      assistantTooltip: 'Asistente Calc-E',
      finBadge: 'Finanzas e Hipotecas',
      finTitle: 'Calculadora de Hipoteca Avanzada',
      loanAmountLabel: 'Monto del Préstamo',
      interestLabel: 'Interés Anual (%)',
      monthlyEstLabel: 'Pago Mensual Estimado',
      healthBadge: 'Salud',
      healthTitle: 'Índice BMI',
      healthStatus: 'Normal',
      bmiBtn: 'Calcular BMI',
      realEstateBadge: 'Bienes Raíces',
      realEstateTitle: 'Rendimiento de Alquiler',
      realEstateDesc: 'Calcula rápidamente la rentabilidad anual de tu propiedad de inversión.',
      realEstateBtn: 'Calcular Rendimiento',
      mathBadge: 'Matemáticas y Conversiones',
      mathTitle: 'Convertidor de Unidades',
      weight: 'Peso',
      distance: 'Distancia',
      temp: 'Temperatura',
      moreConversions: 'Más conversiones...'
    },
    fr: {
      heroTitle: 'Chaque calculateur dont vous avez besoin, au même endroit',
      heroSubtitle: 'Des outils de calcul performants, précis et fiables pour tous vos besoins.',
      heroSearchPlaceholder: 'Quel calcul souhaitez-vous effectuer aujourd\'hui ?',
      assistantTooltip: 'Assistant Calc-E',
      finBadge: 'Finance & Prêts',
      finTitle: 'Calculateur d\'Hypothèque Avancé',
      loanAmountLabel: 'Montant du Prêt',
      interestLabel: 'Taux Annuel (%)',
      monthlyEstLabel: 'Paiement Mensuel Estimé',
      healthBadge: 'Santé',
      healthTitle: 'Indice IMC / BMI',
      healthStatus: 'Normal',
      bmiBtn: 'Calculer l\'IMC',
      realEstateBadge: 'Immobilier',
      realEstateTitle: 'Rendement Locatif',
      realEstateDesc: 'Calculez rapidement le rendement annuel de votre bien immobilier.',
      realEstateBtn: 'Calculer le Rendement',
      mathBadge: 'Maths & Conversions',
      mathTitle: 'Convertisseur d\'Unités',
      weight: 'Poids',
      distance: 'Distance',
      temp: 'Température',
      moreConversions: 'Plus de conversions...'
    },
    ar: {
      heroTitle: 'كل حاسبة تحتاجها، في مكان واحد',
      heroSubtitle: 'أدوات حسابية احترافية ودقيقة وموثوقة لجميع الأغراض. من المالية إلى الصحة - إجاباتك هنا.',
      heroSearchPlaceholder: 'ما الحساب الذي تريد إجراءه اليوم؟',
      assistantTooltip: 'مساعد Calc-E',
      finBadge: 'التمويل والرهن العقاري',
      finTitle: 'حاسبة الرهن العقاري المتقدمة',
      loanAmountLabel: 'مبلغ القرض',
      interestLabel: 'الفائدة السنوية (%)',
      monthlyEstLabel: 'القسط الشهر المتوقع',
      healthBadge: 'الصحة',
      healthTitle: 'مؤشر كتلة الجسم BMI',
      healthStatus: 'طبيعي',
      bmiBtn: 'احسب مؤشر BMI',
      realEstateBadge: 'العقارات',
      realEstateTitle: 'العائد الإيجاري',
      realEstateDesc: 'احسب بسرعة العائد السنوي لملكية الاستثمار الخاصة بك.',
      realEstateBtn: 'احسب العائد',
      mathBadge: 'الرياضيات والتحويلات',
      mathTitle: 'محول الوحدات السريع',
      weight: 'الوزن',
      distance: 'المسافة',
      temp: 'الحرارة',
      moreConversions: 'المزيد من التحويلات...'
    }
  };

  const currText = bentoTexts[lang as keyof typeof bentoTexts] || bentoTexts.en;

  return (
    <div className="w-full">
      <SEO
        title={t.libraryTitle}
        description={t.librarySubtitle}
        keywords={['calculators', 'assistant', 'Calc-E', 'finance', 'health', 'math', 'tools']}
        canonicalUrl={`/${lang}/all`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: t.title,
          description: t.librarySubtitle,
          url: `https://globalcalcpro.com/${lang}/all`,
          potentialAction: {
            '@type': 'SearchAction',
            target: `https://globalcalcpro.com/${lang}/all?search={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      {/* Proposal 1: 3D Glassmorphism & Parallax Mesh Hero Section */}
      <section 
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="text-center mb-12 sm:mb-16 relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-border-subtle/60 p-8 sm:p-12 md:p-16 shadow-lg transition-all"
      >
        {/* Background Mesh Grid */}
        <Squares 
          direction="diagonal"
          speed={0.4}
          borderColor="rgba(0, 107, 91, 0.06)"
          hoverFillColor="rgba(0, 107, 91, 0.12)"
          squareSize={48}
        />

        {/* 3D Glassmorphism Backdrop Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img 
            src="/images/hero-proposal-1.jpg" 
            alt="3D Glassmorphism Calculator Engine" 
            className="w-full h-full object-cover opacity-20 dark:opacity-25 mix-blend-multiply dark:mix-blend-screen scale-105 transition-transform duration-700 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/80 to-surface-container-lowest" />
        </div>

        {/* Floating 3D Parallax Glass Cards */}
        {/* Glass Card 1 - Top Right */}
        <motion.div 
          style={{ x: card1X, y: card1Y }}
          className="hidden lg:flex absolute top-8 ltr:right-8 rtl:left-8 z-20 items-center gap-3 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-white/80 dark:border-neutral-700/80 p-3.5 px-4 rounded-2xl shadow-xl pointer-events-none"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg shadow-inner">
            ₪
          </div>
          <div className="text-start">
            <div className="text-xs text-text-muted font-medium">{isRtl ? 'חישובים שבוצעו' : 'Calculations Done'}</div>
            <div className="text-sm font-extrabold text-primary-container font-mono-num flex items-center gap-1.5">
              <CountUp from={1000000} to={2540890} separator="," duration={2} />
              <span className="text-xs text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">+24%</span>
            </div>
          </div>
        </motion.div>

        {/* Glass Card 2 - Bottom Left */}
        <motion.div 
          style={{ x: card2X, y: card2Y }}
          className="hidden lg:flex absolute bottom-10 ltr:left-8 rtl:right-8 z-20 items-center gap-3 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-white/80 dark:border-neutral-700/80 p-3.5 px-4 rounded-2xl shadow-xl pointer-events-none"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            f(x)
          </div>
          <div className="text-start">
            <div className="text-xs text-text-muted font-medium">{isRtl ? 'מנוע חישוב מדויק' : 'Accuracy Engine'}</div>
            <div className="text-xs font-mono font-bold text-primary-container">
              Decimal.js • 100% Precision
            </div>
          </div>
        </motion.div>

        {/* Glass Card 3 - Top Left Floating Pill */}
        <motion.div 
          style={{ x: card3X, y: card3Y }}
          className="hidden xl:flex absolute top-12 ltr:left-12 rtl:right-12 z-20 items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm text-emerald-700 dark:text-emerald-300 text-xs font-bold pointer-events-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isRtl ? 'מעודכן לתקנות המס 2026' : 'Updated to 2026 Tax Rules'}</span>
        </motion.div>

        {/* Main Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-base text-teal-600 dark:text-teal-400">auto_awesome</span>
            <span>{isRtl ? 'פלטפורמת החישובים הבינלאומית' : 'International Calculation Platform'}</span>
          </motion.div>

          <h1 className="font-display-xl text-3xl sm:text-4xl md:text-5xl text-primary-container mb-4 font-extrabold tracking-tight leading-tight">
            {currText.heroTitle}
          </h1>
          <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
            {currText.heroSubtitle}
          </p>
  
          {/* Search Hero Box with Enhanced Glass Shell */}
          <div className="relative max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-full bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-white/60 dark:border-neutral-700/60 p-2 sm:p-2.5 rounded-2xl shadow-2xl transition-all hover:shadow-teal-500/10">
              <SearchBar isHero placeholder={currText.heroSearchPlaceholder} />
            </div>
            
            {/* Dynamic Search Suggestions with RotatingText */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-text-muted">
              <span className="font-semibold text-secondary">{isRtl ? 'חיפושים נפוצים:' : 'Popular:'}</span>
              <RotatingText
                texts={
                  isRtl
                    ? ['חישוב שכר נטו', 'החזר משכנתא חודשי', 'ריבית דריבית וחיסכון', 'אופציות ו-RSU', 'פיצויי פיטורין', 'מס רכישה ושבח']
                    : ['Net Salary Take-Home', 'Monthly Mortgage Payment', 'Compound Interest Growth', 'Stock Options & RSU', 'Severance Pay', 'Real Estate Cap Rate']
                }
                rotationInterval={2800}
                className="font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20"
                elementClassName="text-primary-container"
              />
            </div>

            {/* Micro Trust Indicators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-on-surface-variant font-medium">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-500 text-sm">verified</span>
                {isRtl ? '36+ מחשבונים מקצועיים' : '36+ Professional Calculators'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-teal-500 text-sm">bolt</span>
                {isRtl ? 'חישוב בריאל-טיים' : 'Real-time Calculations'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-500 text-sm">lock</span>
                {isRtl ? 'ללא שמירת נתונים אישיים' : '100% Private & Anonymous'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Bento Grid Showcase */}
      {activeCategory === "all" && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap mb-12 sm:mb-16">
          {/* Finance & Mortgages (Large Card - 8 Cols) */}
          <div 
            onClick={() => navigate(`/${lang}/mortgage-calculator`)}
            className="md:col-span-8 group cursor-pointer"
          >
            <SpotlightCard
              className="p-6 sm:p-8 ambient-shadow flex flex-col h-full hover:border-secondary transition-all"
              spotlightColor="rgba(0, 107, 91, 0.12)"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <span className="material-symbols-outlined filled text-xl">account_balance</span>
                    <span className="font-label-bold text-label-bold">{currText.finBadge}</span>
                  </div>
                  <h2 className="font-headline-md text-xl sm:text-headline-md text-primary-container group-hover:text-secondary transition-colors">
                    {currText.finTitle}
                  </h2>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-all text-2xl">
                  {isRtl ? 'arrow_back' : 'arrow_forward'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow items-center">
                {/* Controls */}
                <form toolname="quick_mortgage_calculator" tooldescription="Quick mortgage estimation form for principal loan amount and interest rate" onSubmit={(e) => e.preventDefault()} className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <label htmlFor="quick-mortgage-amount" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                      {currText.loanAmountLabel}
                    </label>
                    <div className="input-focus-ring flex items-center border border-border-subtle rounded-lg bg-surface py-2 px-3">
                      <span className="text-text-muted font-bold ml-1.5 ltr:mr-1.5 ltr:ml-0">₪</span>
                      <input
                        id="quick-mortgage-amount"
                        aria-label={currText.loanAmountLabel}
                        toolparamdescription="Loan principal amount in ILS currency"
                        type="number"
                        value={mortgageAmount}
                        onChange={(e) => setMortgageAmount(Number(e.target.value) || 0)}
                        className="bg-transparent border-none p-0 w-full font-mono-num text-mono-num text-primary-container focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="quick-mortgage-rate" className="font-label-sm text-label-sm text-on-surface-variant">
                        {currText.interestLabel}
                      </label>
                      <span className="font-mono-num text-sm text-primary-container font-bold">{mortgageRate}%</span>
                    </div>
                    <input
                      id="quick-mortgage-rate"
                      aria-label={currText.interestLabel}
                      toolparamdescription="Annual mortgage interest rate percentage"
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={mortgageRate}
                      onChange={(e) => setMortgageRate(Number(e.target.value))}
                      className="w-full accent-secondary cursor-pointer h-2 bg-surface-variant rounded-lg"
                    />
                  </div>
                </form>

                {/* Result Preview */}
                <div className="bg-primary-container rounded-xl p-5 flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden">
                  <img src="/images/cat-finance.webp" alt="Finance" className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay pointer-events-none" />
                  <div className="relative z-10">
                    <span className="font-label-sm text-label-sm text-primary-fixed-dim mb-1">
                      {currText.monthlyEstLabel}
                    </span>
                    <div className="font-display-xl text-3xl sm:text-display-xl text-secondary-fixed font-extrabold tracking-tight">
                      <CountUp to={estimatedMonthly} prefix="₪" duration={0.6} />
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Health & BMI (Small Card - 4 Cols) */}
          <div 
            onClick={() => navigate(`/${lang}/bmi-calculator`)}
            className="md:col-span-4 group cursor-pointer"
          >
            <SpotlightCard
              className="p-6 sm:p-8 ambient-shadow flex flex-col h-full hover:border-secondary transition-all"
              spotlightColor="rgba(0, 107, 91, 0.12)"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <span className="material-symbols-outlined filled text-xl">favorite</span>
                    <span className="font-label-bold text-label-bold">{currText.healthBadge}</span>
                  </div>
                  <h2 className="font-headline-md text-xl text-primary-container group-hover:text-secondary transition-colors">
                    {currText.healthTitle}
                  </h2>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors">
                  {isRtl ? 'arrow_back' : 'arrow_forward'}
                </span>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center py-2 relative">
                <img src="/images/cat-health.webp" alt="Health" className="absolute inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none rounded-xl" />
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-surface-variant flex items-center justify-center relative shadow-xs bg-surface/50 backdrop-blur-sm">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="opacity-90 transition-all duration-500"
                      cx="50"
                      cy="50"
                      fill="none"
                      r="45"
                      stroke="#006b5b"
                      strokeDasharray="180 288"
                      strokeWidth="8"
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="text-center z-10">
                    <div className="font-display-xl text-2xl sm:text-display-xl text-primary-container font-extrabold leading-none">
                      23.5
                    </div>
                    <div className="font-label-bold text-xs sm:text-label-sm text-secondary mt-1 font-bold">
                      {currText.healthStatus}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/${lang}/bmi-calculator`);
                  }}
                  className="w-full bg-surface text-primary-container border border-primary-container font-label-bold text-label-bold py-2.5 rounded-xl hover:bg-primary-container hover:text-on-primary transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{currText.bmiBtn}</span>
                  <span className="material-symbols-outlined text-base">calculate</span>
                </button>
              </div>
            </SpotlightCard>
          </div>

          {/* Real Estate (Medium Card - 6 Cols) */}
          <div 
            onClick={() => navigate(`/${lang}/calculators/cap-rate`)}
            className="md:col-span-6 group cursor-pointer"
          >
            <SpotlightCard
              className="p-6 sm:p-8 ambient-shadow flex flex-col h-full hover:border-secondary transition-all relative overflow-hidden"
              spotlightColor="rgba(0, 107, 91, 0.12)"
            >
              <img src="/images/cat-real-estate.webp" alt="Real Estate" className="absolute top-0 rtl:left-0 ltr:right-0 w-48 h-48 object-cover opacity-[0.04] pointer-events-none mix-blend-multiply rounded-bl-3xl rtl:rounded-br-3xl rtl:rounded-bl-none z-0" />
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <span className="material-symbols-outlined filled text-xl">real_estate_agent</span>
                    <span className="font-label-bold text-label-bold">{currText.realEstateBadge}</span>
                  </div>
                  <h2 className="font-headline-md text-xl text-primary-container group-hover:text-secondary transition-colors">
                    {currText.realEstateTitle}
                  </h2>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors">
                  {isRtl ? 'arrow_back' : 'arrow_forward'}
                </span>
              </div>
              
              <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed relative z-10">
                {currText.realEstateDesc}
              </p>

              <div className="mt-auto relative z-10">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/${lang}/calculators/cap-rate`);
                  }}
                  className="w-full bg-surface text-primary-container border border-primary-container font-label-bold text-label-bold py-3 rounded-xl hover:bg-primary-container hover:text-on-primary transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{currText.realEstateBtn}</span>
                  <span className="material-symbols-outlined text-base">calculate</span>
                </button>
              </div>
            </SpotlightCard>
          </div>

          {/* Math & Conversions (Medium Card - 6 Cols) */}
          <div 
            onClick={() => navigate(`/${lang}/unit-converter`)}
            className="md:col-span-6 group cursor-pointer"
          >
            <SpotlightCard
              className="p-6 sm:p-8 ambient-shadow flex flex-col h-full hover:border-secondary transition-all"
              spotlightColor="rgba(0, 107, 91, 0.12)"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <span className="material-symbols-outlined filled text-xl">functions</span>
                    <span className="font-label-bold text-label-bold">{currText.mathBadge}</span>
                  </div>
                  <h2 className="font-headline-md text-xl text-primary-container group-hover:text-secondary transition-colors">
                    {currText.mathTitle}
                  </h2>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors">
                  {isRtl ? 'arrow_back' : 'arrow_forward'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="bg-surface border border-border-subtle rounded-xl p-3 text-center hover:border-secondary hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="font-label-bold text-label-bold text-primary-container">Kg ↔ Lb</div>
                  <div className="font-label-sm text-xs text-text-muted mt-0.5">{currText.weight}</div>
                </div>
                <div className="bg-surface border border-border-subtle rounded-xl p-3 text-center hover:border-secondary hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="font-label-bold text-label-bold text-primary-container">Km ↔ Mi</div>
                  <div className="font-label-sm text-xs text-text-muted mt-0.5">{currText.distance}</div>
                </div>
                <div className="bg-surface border border-border-subtle rounded-xl p-3 text-center hover:border-secondary hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="font-label-bold text-label-bold text-primary-container">°C ↔ °F</div>
                  <div className="font-label-sm text-xs text-text-muted mt-0.5">{currText.temp}</div>
                </div>
                <div className="bg-surface border border-border-subtle rounded-xl p-3 text-center flex items-center justify-center hover:border-secondary hover:bg-secondary/10 transition-colors cursor-pointer text-secondary">
                  <span className="font-label-bold text-xs">{currText.moreConversions}</span>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </section>
      )}

      {/* PWA Promotion Banner */}
      {isPwaPromoCollapsed ? (
        <section 
          className="mb-8 bg-surface-container-lowest text-on-surface rounded-2xl p-4 flex items-center justify-between shadow-xs border border-border-subtle hover:border-secondary transition-colors cursor-pointer" 
          onClick={handleExpandPwa}
          title={isRtl ? 'הרחב' : 'Expand'}
        >
           <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-secondary text-2xl">apps</span>
             <h2 className="font-headline-md text-primary m-0 text-sm md:text-base font-bold">{t.pwaPromoTitle}</h2>
           </div>
           <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
        </section>
      ) : (
        <section className="mb-10 bg-surface-container-lowest text-on-surface rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-border-subtle hover:border-secondary/50 transition-colors relative overflow-hidden">
          <button 
            onClick={handleCollapsePwa}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-surface hover:bg-surface-container text-on-surface-variant transition-colors border border-border-subtle shadow-xs cursor-pointer"
            title={isRtl ? 'צמצם' : 'Collapse'}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="flex-grow z-10 text-center md:text-left rtl:md:text-right">
            <h2 className="font-headline-lg-mobile sm:font-headline-lg mb-2 text-primary-container font-extrabold">{t.pwaPromoTitle}</h2>
            <p className="font-body-md text-on-surface-variant mb-4 max-w-xl text-sm sm:text-base">{t.pwaPromoDesc}</p>
            
            <ul className="flex flex-col md:flex-row gap-3 md:gap-6 font-label-bold text-sm text-on-surface-variant mb-6">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">bolt</span>
                {(t as any).pwaPromoBen1 || 'Fast loading & offline'}
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">no_sim</span>
                {(t as any).pwaPromoBen2 || 'No app store needed'}
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">sd_storage</span>
                {(t as any).pwaPromoBen3 || 'Minimal storage'}
              </li>
            </ul>
            
            <div className="bg-secondary/5 border border-secondary/15 rounded-xl p-4 md:inline-block text-right rtl:text-right ltr:text-left">
              <p className="font-label-bold text-secondary text-sm mb-1.5 flex items-center justify-center md:justify-start gap-1.5 font-bold">
                <span className="material-symbols-outlined text-base">download</span>
                {isRtl ? 'איך מתקינים?' : 'How to install?'}
              </p>
              <ol className="font-body-md text-xs sm:text-sm list-decimal list-inside text-on-surface-variant space-y-1">
                <li>{(t as any).pwaPromoStep1 || 'Tap browser menu (⋮)'}</li>
                <li>{(t as any).pwaPromoStep2 || 'Select "Add to Home Screen"'}</li>
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter Pills */}
      <section id="category-filters" className="mb-8 overflow-x-auto pb-3 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {categories.map((cat) => {
            const path = cat.id === "all" ? `/${lang}/all` : `/${lang}/category/${cat.id}`;
            return (
              <Magnet key={cat.id} padding={20} magnetStrength={4}>
                <Link
                  to={path}
                  className={`inline-block px-5 py-2 rounded-full font-label-bold text-label-bold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-secondary text-on-secondary shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface border border-border-subtle"
                  }`}
                >
                  {cat.label}
                </Link>
              </Magnet>
            );
          })}
        </div>
      </section>

      {/* Complete Calculator Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((calc) => {
          const title = getCalculatorTitle(calc, t, lang);
          const description = getCalculatorDescription(calc, t, lang);
          
          return (
            <Link
              key={calc.id}
              to={`/${lang}${calc.path}`}
              className="block group h-full"
            >
              <SpotlightCard
                className="p-6 flex flex-col h-full hover:border-secondary hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
                spotlightColor="rgba(0, 107, 91, 0.12)"
              >
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="bg-surface-container-low px-2.5 py-1 rounded-md border border-border-subtle/50">
                    <span className="text-[11px] font-label-bold uppercase tracking-wider text-secondary whitespace-nowrap">
                      {calc.category}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-transform duration-300 shrink-0">
                    {isRtl ? 'arrow_back' : 'arrow_forward'}
                  </span>
                </div>
                
                <h3 className="font-headline-md text-xl font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-3">
                  {title}
                </h3>
                
                <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {description}
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-2 mt-auto pt-4 border-t border-border-subtle/50">
                  {calc.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="font-label-sm text-[12px] font-medium text-outline-variant before:content-['#'] before:opacity-50 before:mr-0.5 rtl:before:ml-0.5 rtl:before:mr-0 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
