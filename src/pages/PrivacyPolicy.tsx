import SEO from '../components/SEO';
import { useI18n, Language } from '../contexts/i18n';

interface PrivacyContent {
  lastUpdated: string;
  sec1Title: string;
  sec1Desc: string;
  sec2Title: string;
  sec2Desc: string;
  sec3Title: string;
  sec3Desc: string;
  sec4Title: string;
  sec4Desc: string;
  sec5Title: string;
  sec5Desc: string;
}

const privacyTexts: Record<Language, PrivacyContent> = {
  he: {
    lastUpdated: 'עודכן לאחרונה: אוקטובר 2026',
    sec1Title: '1. מידע שאנו אוספים',
    sec1Desc: 'באתר GlobalCalc Pro, הזמין בכתובת globalcalcpro.com, פרטיות המבקרים עומדת בראש סדר העדיפויות שלנו. השימוש בכל מחשבוני וכלי האתר הינו חינמי ואינו דורש הרשמה, פתיחת חשבון או הזנת פרטים מזהים אישיים. עם זאת, קובצי יומן שרת סטנדרטיים ותוכנות ניתוח עשויים לאסוף מידע טכני בלתי-מזהה כגון כתובות IP, סוג דפדפן, ספק שירותי אינטרנט (ISP), חותמות זמן/תאריך ודפי הפניה.',
    sec2Title: '2. קובצי עוגיות (Cookies) ואחסון מקומי',
    sec2Desc: 'GlobalCalc Pro עושה שימוש בקובצי עוגיות ובאחסון מקומי בדפדפן (Local Storage) לצורך שמירת העדפות משתמש (כגון בחירת שפה, ערכת נושא, היסטוריית חישובים מקומית במכשירכם) ולצורך שיפור חוויית הגלישה. כל נתוני החישובים נשמרים מקומית בדפדפן שלכם בלבד ואינם נשלחים לשרתינו.',
    sec3Title: '3. שירותי צד שלישי ומודעות',
    sec3Desc: 'ספקי צד שלישי (כגון Google Analytics) עשויים להשתמש בעוגיות לצורך ניתוח ביצועי האתר והצגת מודעות מותאמות. המשתמשים רשאים לבטל שימוש זה דרך הגדרות הפרטיות בדפדפן או בעמוד מדיניות הפרטיות של Google.',
    sec4Title: '4. זכויות פרטיות (GDPR / CCPA)',
    sec4Desc: 'בהתאם לתקנות הפרטיות הבינלאומיות, היות ואיננו אוספים או שומרים מידע אישי מזהה בבסיסי נתונים, פרטיותכם האישית מוגנת באופן מוחלט.',
    sec5Title: '5. יצירת קשר',
    sec5Desc: 'בכל שאלה או בירור בנוגע למדיניות הפרטיות, ניתן לפנות אלינו באמצעות דף יצירת הקשר באתר.'
  },
  en: {
    lastUpdated: 'Last updated: October 2026',
    sec1Title: '1. Information We Collect',
    sec1Desc: 'At GlobalCalc Pro (globalcalcpro.com), your privacy is our highest priority. Using our calculation tools is completely free and requires no registration or personal accounts. Standard server logs and analytics software collect non-personally identifiable technical information (e.g., browser type, referring pages, timestamps).',
    sec2Title: '2. Cookies & Local Storage',
    sec2Desc: 'We utilize localized browser storage (localStorage) strictly to persist your preferences, such as selected language, theme, and private calculation history directly on your own device. No financial or health calculation data is transmitted to external servers.',
    sec3Title: '3. Third-Party Services & Analytics',
    sec3Desc: 'Third-party vendors (such as Google Analytics) may set functional cookies to measure general website performance and aggregated usage statistics. You may adjust or disable cookies anytime in your browser settings.',
    sec4Title: '4. Privacy Compliance (GDPR & CCPA)',
    sec4Desc: 'In accordance with global privacy frameworks, we do not store, sell, or monetize personally identifiable information on backend databases. Your privacy remains mathematically and architecturally protected.',
    sec5Title: '5. Contact Support',
    sec5Desc: 'If you have questions or inquiries regarding our Privacy Policy, please reach out through our Contact page.'
  },
  es: {
    lastUpdated: 'Última actualización: Octubre 2026',
    sec1Title: '1. Información que Recopilamos',
    sec1Desc: 'En GlobalCalc Pro, accesible desde globalcalcpro.com, la privacidad de nuestros usuarios es primordial. El uso de todas las herramientas de cálculo es gratuito y no requiere registro ni cuentas personales. Los servidores solo registran información técnica no identificable (navegador, fecha y hora).',
    sec2Title: '2. Cookies y Almacenamiento Local',
    sec2Desc: 'Utilizamos almacenamiento local en su navegador (localStorage) para guardar sus preferencias de idioma, temas e historial de cálculos de manera 100% privada en su dispositivo. Ningún dato sensible se envía a servidores externos.',
    sec3Title: '3. Servicios de Terceros y Analíticas',
    sec3Desc: 'Proveedores analíticos autorizados pueden emplear cookies técnicas para evaluar el rendimiento global de la plataforma. Puede desactivar las cookies en la configuración de su navegador.',
    sec4Title: '4. Cumplimiento de Privacidad (GDPR / CCPA)',
    sec4Desc: 'Cumpliendo con los estándares internacionales, no almacenamos ni comercializamos datos personales de identificación en bases de datos.',
    sec5Title: '5. Contacto',
    sec5Desc: 'Para cualquier consulta relacionada con nuestra política de privacidad, contáctenos a través de la página de contacto.'
  },
  fr: {
    lastUpdated: 'Dernière mise à jour : Octobre 2026',
    sec1Title: '1. Données Collectées',
    sec1Desc: 'Sur GlobalCalc Pro, la confidentialité de nos utilisateurs est une priorité absolue. L\'accès à tous les calculateurs est gratuit et ne requiert aucune inscription ni transmission d\'identité personnelle. Seules les données techniques usuelles de connexion sont enregistrées.',
    sec2Title: '2. Cookies et Stockage Local',
    sec2Desc: 'Nous utilisons le stockage local du navigateur (localStorage) pour conserver vos préférences de langue et votre historique de calcul directement sur votre appareil, en toute confidentialité.',
    sec3Title: '3. Services Tiers et Mesure d\'Audience',
    sec3Desc: 'Des outils de mesure de performance (comme Google Analytics) peuvent déposer des cookies pour analyser l\'utilisation globale du site. Vous pouvez les refuser dans votre navigateur.',
    sec4Title: '4. Droits RGPD et Protection des Données',
    sec4Desc: 'Conformément au RGPD, nous ne collectons ni ne conservons aucune information nominative sur nos serveurs. Vos données demeurent strictement locales.',
    sec5Title: '5. Nous Contacter',
    sec5Desc: 'Pour toute question relative à cette politique de confidentialité, vous pouvez nous écrire via notre page Contact.'
  },
  ar: {
    lastUpdated: 'آخر تحديث: أكتوبر 2026',
    sec1Title: '1. المعلومات التي نجمعها',
    sec1Desc: 'في GlobalCalc Pro، خصوصية زوارنا هي أولويتنا القصوى. استخدام جميع الأدوات الحسابية مجاني تماماً ولا يتطلب تسجيلاً أو إنشاء حساب شخصي. تسجل الخوادم فقط بيانات فنية مجهولة المصدر مثل نوع المتصفح وتاريخ الزيارة.',
    sec2Title: '2. ملفات تعريف الارتباط والتخزين المحلي',
    sec2Desc: 'نستخدم التخزين المحلي في المتصفح (localStorage) لحفظ تفضيلاتك مثل اللغة وسجل الحسابات مباشرة على جهازك وبأمان تام دون إرسال أي أرقام لخوادم خارجية.',
    sec3Title: '3. خدمات الطرف الثالث والتحليلات',
    sec3Desc: 'قد تستخدم أدوات التحليلات ملفات تعريف الارتباط لتحسين أداء المنصة. يمكنك تعطيل هذه الملفات في أي وقت من إعدادات متصفحك.',
    sec4Title: '4. حقوق الخصوصية والامتثال الدولي',
    sec4Desc: 'نلتزم بأعلى معايير الخصوصية الدولية (GDPR / CCPA). لا نقوم بجمع أو بيع أو تخزين أي بيانات شخصية تعريفية في قواعد بياناتنا.',
    sec5Title: '5. اتصل بنا',
    sec5Desc: 'لأي استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة الاتصال بالموقع.'
  },
  ru: {
    lastUpdated: 'Последнее обновление: Октябрь 2026',
    sec1Title: '1. Сбор информации',
    sec1Desc: 'Конфиденциальность посетителей — главный приоритет GlobalCalc Pro. Все калькуляторы бесплатны и не требуют регистрации или создания учетной записи. Серверные логи фиксируют только неперсонализированные технические данные (тип браузера, время посещения).',
    sec2Title: '2. Файлы cookie и локальное хранилище',
    sec2Desc: 'Мы используем локальное хранилище браузера (localStorage) исключительно для сохранения языковых настроек и локальной истории расчетов на вашем устройстве. Никакие расчетные данные не передаются на серверы.',
    sec3Title: '3. Сторонние аналитические сервисы',
    sec3Desc: 'Аналитические инструменты могут использовать технические cookies для оценки стабильности работы сервиса. Вы можете отключить их в настройках своего браузера.',
    sec4Title: '4. Защита данных (GDPR / CCPA)',
    sec4Desc: 'Мы не собираем, не храним и не продаем персональные идентификационные данные. Ваша конфиденциальность защищена локальной архитектурой вычислений.',
    sec5Title: '5. Связь с нами',
    sec5Desc: 'По любым вопросам относительно политики конфиденциальности вы можете связаться с нами через форму обратной связи.'
  }
};

export default function PrivacyPolicy() {
  const { t, lang } = useI18n();
  const content = privacyTexts[lang] || privacyTexts.en;

  return (
    <article className="w-full bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 max-w-3xl mx-auto space-y-6 text-stone-700">
      <SEO
        title={t.privacyTitle}
        description={t.privacyDesc}
        canonicalUrl={`/${lang}/privacy-policy`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.privacyTitle,
          description: t.privacyDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/privacy-policy`
        }}
      />

      <h1 className="text-3xl md:text-4xl font-headline text-stone-900 tracking-tight font-bold">
        {t.privacyTitle}
      </h1>

      <p className="text-sm text-stone-600">
        {content.lastUpdated}
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">{content.sec1Title}</h2>
        <p className="text-stone-600 leading-relaxed text-sm">{content.sec1Desc}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">{content.sec2Title}</h2>
        <p className="text-stone-600 leading-relaxed text-sm">{content.sec2Desc}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">{content.sec3Title}</h2>
        <p className="text-stone-600 leading-relaxed text-sm">{content.sec3Desc}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">{content.sec4Title}</h2>
        <p className="text-stone-600 leading-relaxed text-sm">{content.sec4Desc}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">{content.sec5Title}</h2>
        <p className="text-stone-600 leading-relaxed text-sm">{content.sec5Desc}</p>
      </section>
    </article>
  );
}
