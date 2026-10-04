import SEO from '../components/SEO';
import { useI18n, Language } from '../contexts/i18n';

interface TermsContent {
  lastUpdated: string;
  sec1Title: string;
  sec1Desc: string;
  sec2Title: string;
  sec2Desc: string;
  sec21Title: string;
  sec21Desc: string;
  sec22Title: string;
  sec22Desc: string;
  sec23Title: string;
  sec23Desc: string;
  sec3Title: string;
  sec3Desc: string;
  sec4Title: string;
  sec4Desc: string;
  sec5Title: string;
  sec5Desc: string;
}

const termsTexts: Record<Language, TermsContent> = {
  he: {
    lastUpdated: 'עודכן לאחרונה: אוקטובר 2026',
    sec1Title: '1. קבלת תנאי השימוש',
    sec1Desc: 'השימוש באתר GlobalCalc Pro (globalcalcpro.com) ובכל הכלים, המחשבונים והמדריכים המוצעים בו, מותנה בהסכמתך המלאה לתנאי שימוש אלה. אם אינך מסכים לתנאים אלו, הנך מתבקש שלא לעשות כל שימוש באתר.',
    sec2Title: '2. כתב ויתור והעדר ייעוץ מקצועי',
    sec2Desc: 'כל המחשבונים, ההמרות, התרחישים, הנוסחאות והתכנים באתר נועדו למטרות סימולציה, הערכה כללית, לימוד והעשרה בלבד. בשום מקרה אין לראות במידע או בתוצאות החישוב משום ייעוץ מקצועי, והם אינם יוצרים יחסי מומחה-לקוח.',
    sec21Title: '2.1 העדר ייעוץ רפואי או קליני',
    sec21Desc: 'כלי הבריאות, מדד ה-BMI, מחשבון שבועות ההריון ותאריך הלידה, צריכת המים ומחשבוני השינה אינם מספקים ייעוץ רפואי, אבחנה קלינית, פרוגנוזה או תוכנית טיפול. הם אינם תחליף לבדיקה גופנית, שיקול דעת קליני או התייעצות אישית עם רופא/ת נשים (OB/GYN), רופא משפחה או איש צוות רפואי מוסמך.',
    sec22Title: '2.2 העדר ייעוץ פיננסי, השקעות או משכנתאות',
    sec22Desc: 'מחשבוני המשכנתא, ריבית דריבית, לוחות סילוקין, הלוואות רכב, תשואות נדל"ן ומדדי אינפלציה מספקים קירובים מתמטיים בהתבסס על נתוני הקלט של המשתמש בלבד. נתונים אלו אינם מהווים ייעוץ השקעות, ייעוץ פנסיוני, ייעוץ משכנתאות או התחייבות פיננסית.',
    sec23Title: '2.3 העדר ייעוץ משפטי או ייעוץ מס',
    sec23Desc: 'מחשבוני השכר, פיצויי פיטורין, מיסוי מקרקעין (מס רכישה/שבח), מע"מ ואופציות עובדים הם סימולטורים חישוביים בלבד ואינם מהווים חוות דעת משפטית, ייעוץ בדיני עבודה או ייעוץ מס מוסמך. יש להיוועץ בעורך דין או יועץ מס מוסמך.',
    sec3Title: '3. הגבלת אחריות מוחלטת ואספקה "כמות שהוא" (AS IS)',
    sec3Desc: 'האתר והשירותים ניתנים לשימוש "כמות שהם" (AS IS) וללא אחריות מכל סוג שהוא. מפעילי האתר אינם מתחייבים לדיוק מוחלט, עדכניות או התאמה למטרה מסוימת. בשום מקרה לא יישאו האתר או מפתחיו באחריות לנזק כלשהו הנובע משימוש באתר.',
    sec4Title: '4. קניין רוחני',
    sec4Desc: 'הקוד, העיצוב, הממשק, הטקסטים והרכיבים הוויזואליים של GlobalCalc Pro מוגנים בחוקי זכויות יוצרים וקניין רוחני.',
    sec5Title: '5. שינויים בתנאים ובשירות',
    sec5Desc: 'אנו שומרים לעצמנו את הזכות לשנות, לעדכן או להפסיק כל רכיב או שירות באתר בכל עת וללא הודעה מוקדמת.'
  },
  en: {
    lastUpdated: 'Last updated: October 2026',
    sec1Title: '1. Acceptance of Terms',
    sec1Desc: 'By accessing and using GlobalCalc Pro (globalcalcpro.com) and any calculators or guides, you agree to be bound by these Terms of Service. If you disagree with any portion, please discontinue using the service.',
    sec2Title: '2. Disclaimers & No Professional Advice',
    sec2Desc: 'All calculation tools, algorithms, estimates, and data are provided strictly for educational and simulation purposes. Results do not constitute certified professional advice.',
    sec21Title: '2.1 No Medical Advice',
    sec21Desc: 'Health, BMI, pregnancy due date, sleep, and water intake tools do not provide medical diagnosis, treatment plans, or clinical directives. Always consult certified physicians or healthcare practitioners.',
    sec22Title: '2.2 No Financial or Investment Advice',
    sec22Desc: 'Mortgage, compound interest, amortization, loan, and real estate tools provide mathematical approximations. They do not constitute official financial, lending, investment, or banking advice.',
    sec23Title: '2.3 No Legal or Tax Advice',
    sec23Desc: 'Salary, severance, capital gains, and VAT tools are mathematical estimators and do not replace legal counsel or licensed certified tax accountants.',
    sec3Title: '3. Limitation of Liability & "AS IS" Warranty',
    sec3Desc: 'The services and calculation outputs are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Users assume full responsibility for decisions made using these tools.',
    sec4Title: '4. Intellectual Property',
    sec4Desc: 'All layout designs, software logic, interface structures, and documentation are protected by applicable intellectual property copyright laws.',
    sec5Title: '5. Service Modifications',
    sec5Desc: 'We reserve the right to update, modify, or enhance any calculator, feature, or policy at any time without prior notice.'
  },
  es: {
    lastUpdated: 'Última actualización: Octubre 2026',
    sec1Title: '1. Aceptación de los Términos',
    sec1Desc: 'Al acceder y utilizar GlobalCalc Pro (globalcalcpro.com), usted acepta cumplir con estos Términos de Servicio. Si no está de acuerdo, por favor absténgase de usar el sitio.',
    sec2Title: '2. Exención de Responsabilidad y Asesoramiento',
    sec2Desc: 'Todas las calculadoras, conversiones y guías se ofrecen con fines exclusivamente educativos y de simulación orientativa. No constituyen asesoramiento profesional colegiado.',
    sec21Title: '2.1 Ausencia de Asesoramiento Médico',
    sec21Desc: 'Las herramientas de salud, IMC, embarazo y sueño no ofrecen diagnósticos ni tratamientos médicos. Consulte siempre con un profesional médico certificado.',
    sec22Title: '2.2 Ausencia de Asesoramiento Financiero',
    sec22Desc: 'Las calculadoras de hipotecas, interés compuesto y amortización son aproximaciones matemáticas que no sustituyen a asesores financieros o hipotecarios con licencia.',
    sec23Title: '2.3 Ausencia de Asesoramiento Legal y Fiscal',
    sec23Desc: 'Las estimaciones salariales, de indemnización o de IVA son de carácter simulado y no reemplazan el consejo de abogados o asesores fiscales.',
    sec3Title: '3. Limitación de Responsabilidad ("TAL CUAL")',
    sec3Desc: 'La plataforma se ofrece "TAL CUAL" sin garantías explícitas o implícitas de ningún tipo sobre precisión o idoneidad.',
    sec4Title: '4. Propiedad Intelectual',
    sec4Desc: 'El código, la interfaz, los textos y los elementos visuales están protegidos por las leyes de propiedad intelectual pertinentes.',
    sec5Title: '5. Modificaciones del Servicio',
    sec5Desc: 'Nos reservamos el derecho de modificar o actualizar cualquier función o término en cualquier momento sin previo aviso.'
  },
  fr: {
    lastUpdated: 'Dernière mise à jour : Octobre 2026',
    sec1Title: '1. Acceptation des Conditions',
    sec1Desc: 'L\'utilisation de GlobalCalc Pro implique votre acceptation sans réserve des présentes conditions d\'utilisation. Si vous refusez ces termes, veuillez cesser toute navigation sur ce site.',
    sec2Title: '2. Avertissement & Absence de Conseil Professionnel',
    sec2Desc: 'L\'ensemble des simulateurs, calculatrices et formules sont mis à disposition à titre purement indicatif et éducatif. Ils ne constituent aucunement un conseil professionnel.',
    sec21Title: '2.1 Absence de Conseil Médical',
    sec21Desc: 'Les outils de santé, IMC, date de grossesse et besoin en eau ne remplacent en aucun cas une consultation médicale ou un diagnostic établi par un praticien.',
    sec22Title: '2.2 Absence de Conseil Financier',
    sec22Desc: 'Les outils d\'hypothèque, d\'intérêts composés et d\'emprunt constituent des approximations mathématiques et non un engagement bancaire ou financier.',
    sec23Title: '2.3 Absence de Conseil Juridique ou Fiscal',
    sec23Desc: 'Les calculatrices fiscales, de salaire ou de TVA ne se substituent pas aux avis d\'experts-comptables ou d\'avocats spécialisés.',
    sec3Title: '3. Limitation de Responsabilité ("EN L\'ÉTAT")',
    sec3Desc: 'Le service est fourni "EN L\'ÉTAT" sans garantie d\'aucune sorte. L\'utilisation des simulateurs s\'effectue sous la seule responsabilité de l\'utilisateur.',
    sec4Title: '4. Propriété Intellectuelle',
    sec4Desc: 'Tous les éléments du site (code, design, textes) sont protégés par le droit d\'auteur et la propriété intellectuelle.',
    sec5Title: '5. Évolution du Service',
    sec5Desc: 'Nous nous réservons le droit de faire évoluer ou de modifier tout outil ou contenu à tout moment et sans préavis.'
  },
  ar: {
    lastUpdated: 'آخر تحديث: أكتوبر 2026',
    sec1Title: '1. قبول شروط الاستخدام',
    sec1Desc: 'استخدام موقع GlobalCalc Pro (globalcalcpro.com) يعني موافقتك الكاملة على هذه الشروط. إذا كنت لا توافق عليها، يرجى التوقف عن استخدام المنصة.',
    sec2Title: '2. إخلاء المسؤولية وغياب الاستشارة المهنية',
    sec2Desc: 'جميع الحاسبات والمحاكيات والنصوص مقدمة لأغراض تعليمية وإرشادية وتقريبية فقط ولا تعد بديلاً عن الاستشارات المتخصصة.',
    sec21Title: '2.1 عدم تقديم استشارات طبية',
    sec21Desc: 'أدوات الصحة، مؤشر كتلة الجسم، حاسبة موعد الولادة والحمل، ومقاييس النوم لا تقدم أي تشخيص علاجي أو طبي. استشر دائماً طبيباً مرخصاً.',
    sec22Title: '2.2 عدم تقديم استشارات مالية أو تمويلية',
    sec22Desc: 'حاسبات الرهن العقاري، الفائدة المركبة، وجداول السداد تقدم تقديرات حسابية فقط ولا تشكل عروضاً تمويلية أو استشارات استثمارية.',
    sec23Title: '2.3 عدم تقديم استشارات قانونية أو ضريبية',
    sec23Desc: 'أدوات حساب الرواتب، مكافأة نهاية الخدمة، وضريبة القيمة المضافة هي محاكيات رقمية ولا تغني عن استشارة محامٍ أو محاسب قانوني.',
    sec3Title: '3. تحديد المسؤولية (كما هي)',
    sec3Desc: 'يتم تقديم الموقع والخدمات "كما هي" دون أي ضمانات من أي نوع، ويتحمل المستخدم وحده كامل المسؤولية عن استخدامه للنتائج.',
    sec4Title: '4. الملكية الفكرية',
    sec4Desc: 'جميع البرمجيات، التصاميم، النصوص والمكونات البصرية محمية بموجب قوانين الملكية الفكرية وحقوق النشر.',
    sec5Title: '5. تعديل الشروط والخدمات',
    sec5Desc: 'نحتفظ بالحق في تعديل أو تحديث أي محتوى أو ميزة في أي وقت دون إشعار مسبق.'
  },
  ru: {
    lastUpdated: 'Последнее обновление: Октябрь 2026',
    sec1Title: '1. Принятие условий использования',
    sec1Desc: 'Использование платформы GlobalCalc Pro (globalcalcpro.com) означает полное согласие с настоящими Условиями. Если вы не согласны с ними, просим прекратить использование сервиса.',
    sec2Title: '2. Отказ от ответственности и отсутствие консультаций',
    sec2Desc: 'Все расчетные алгоритмы, формулы и ориентировочные сценарии предназначены исключительно для ознакомительных и образовательных целей.',
    sec21Title: '2.1 Отсутствие медицинских консультаций',
    sec21Desc: 'Калькуляторы ИМТ, беременности, нормы воды и сна не ставят диагнозы и не назначают лечение. Всегда консультируйтесь с квалифицированным врачом.',
    sec22Title: '2.2 Отсутствие финансовых консультаций',
    sec22Desc: 'Ипотечные и инвестиционные калькуляторы предоставляют математические аппроксимации и не являются официальным финансовым или банковским предложением.',
    sec23Title: '2.3 Отсутствие юридических и налоговых консультаций',
    sec23Desc: 'Расчеты налогов, окладов и выплат при увольнении являются симуляторами и не заменяют консультаций юристов и сертифицированных бухгалтеров.',
    sec3Title: '3. Ограничение ответственности ("КАК ЕСТЬ")',
    sec3Desc: 'Сервис предоставляется на условиях "КАК ЕСТЬ" без каких-либо гарантий. Вся ответственность за использование результатов расчетов лежит на пользователе.',
    sec4Title: '4. Интеллектуальная собственность',
    sec4Desc: 'Программный код, интерфейс, дизайн и тексты GlobalCalc Pro защищены действующим законодательством об авторском праве.',
    sec5Title: '5. Изменение условий и сервиса',
    sec5Desc: 'Мы сохраняем за собой право изменять, обновлять или приостанавливать любые функции или разделы сайта в любое время.'
  }
};

export default function TermsOfService() {
  const { t, lang } = useI18n();
  const content = termsTexts[lang] || termsTexts.en;

  return (
    <article className="w-full bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 max-w-3xl mx-auto space-y-6 text-stone-700">
      <SEO
        title={t.termsTitle}
        description={t.termsDesc}
        canonicalUrl={`/${lang}/terms-of-service`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.termsTitle,
          description: t.termsDesc,
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com/${lang}/terms-of-service`
        }}
      />

      <h1 className="text-3xl md:text-4xl font-headline text-stone-900 tracking-tight font-bold">
        {t.termsTitle}
      </h1>

      <p className="text-sm text-stone-600">
        {content.lastUpdated}
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-900">{content.sec1Title}</h2>
        <p className="text-stone-600 leading-relaxed text-sm">{content.sec1Desc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900">{content.sec2Title}</h2>
        <p className="text-stone-600 leading-relaxed text-sm font-semibold">{content.sec2Desc}</p>

        <div className="space-y-3 ps-3 border-s-2 border-stone-200">
          <div>
            <h3 className="font-bold text-sm text-stone-900">{content.sec21Title}</h3>
            <p className="text-stone-600 leading-relaxed text-xs">{content.sec21Desc}</p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-stone-900">{content.sec22Title}</h3>
            <p className="text-stone-600 leading-relaxed text-xs">{content.sec22Desc}</p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-stone-900">{content.sec23Title}</h3>
            <p className="text-stone-600 leading-relaxed text-xs">{content.sec23Desc}</p>
          </div>
        </div>
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
