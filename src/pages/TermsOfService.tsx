import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';

export default function TermsOfService() {
  const { t, lang } = useI18n();

  const isHebrew = lang === 'he';

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
        {isHebrew ? 'עודכן לאחרונה: ספטמבר 2026' : 'Last updated: September 2026'}
      </p>

      {isHebrew ? (
        <>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">1. קבלת תנאי השימוש</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              השימוש באתר GlobalCalc Pro (globalcalcpro.com) ובכל הכלים, המחשבונים והמדריכים המוצעים בו, מותנה בהסכמתך המלאה לתנאי שימוש אלה. אם אינך מסכים לתנאים אלו, הנך מתבקש שלא לעשות כל שימוש באתר.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900">2. כתב ויתור והעדר ייעוץ מקצועי</h2>
            <p className="text-stone-600 leading-relaxed text-sm font-semibold">
              כל המחשבונים, ההמרות, התרחישים, הנוסחאות והתכנים באתר נועדו למטרות סימולציה, הערכה כללית, לימוד והעשרה בלבד. בשום מקרה אין לראות במידע או בתוצאות החישוב משום ייעוץ מקצועי, והם אינם יוצרים יחסי מומחה-לקוח.
            </p>

            <div className="space-y-3 ps-3 border-s-2 border-stone-200">
              <div>
                <h3 className="font-bold text-sm text-stone-900">2.1 העדר ייעוץ רפואי או קליני</h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  כלי הבריאות, מחשבון ה-BMI, מחשבון שבועות ההריון ותאריך הלידה, צריכת המים ומחשבוני השינה אינם מספקים ייעוץ רפואי, אבחנה קלינית, פרוגנוזה או תוכנית טיפול. הם אינם תחליף לבדיקה גופנית, שיקול דעת קליני או התייעצות אישית עם רופא/ת נשים (OB/GYN), רופא משפחה או איש צוות רפואי מוסמך. בכל שאלה, הריון, תסמינים או החלטה רפואית יש לפנות תמיד לגורם רפואי מוסמך.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-stone-900">2.2 העדר ייעוץ פיננסי, השקעות או משכנתאות</h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  מחשבוני המשכנתא, ריבית דריבית, לוחות סילוקין שפיצר, הלוואות רכב, תשואות נדל"ן ומדדי אינפלציה מספקים קירובים מתמטיים בהתבסס על נתוני הקלט של המשתמש בלבד. נתונים אלו אינם מהווים ייעוץ השקעות, ייעוץ פנסיוני, ייעוץ משכנתאות או התחייבות פיננסית. חובה להיוועץ באנשי מקצוע בעלי רישיון כחוק (יועץ משכנתאות מורשה, יועץ השקעות מוסמך או רואה חשבון) לפני ביצוע התחייבות כספית או חתימה על חוזה.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-stone-900">2.3 העדר ייעוץ משפטי או ייעוץ מס</h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  מחשבוני השכר, פיצויי פיטורין, מיסוי מקרקעין (מס רכישה/שבח), מע"מ ואופציות עובדים הם סימולטורים חישוביים בלבד ואינם מהווים חוות דעת משפטית, ייעוץ בדיני עבודה או ייעוץ מס מוסמך. יש להיוועץ בעורך דין או יועץ מס מוסמך לבחינת המצב המשפטי והחוקי הפרטני שלכם.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">3. הגבלת אחריות מוחלטת ואספקה "כמות שהוא" (AS IS)</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              האתר והשירותים ניתנים לשימוש "כמות שהם" (AS IS) וללא אחריות מכל סוג שהוא, מפורשת או משתמעת. מפעילי האתר אינם מתחייבים לדיוק מוחלט, עדכניות או התאמה למטרה מסוימת. בשום מקרה לא יישאו האתר, מפתחיו, מנהליו או שותפיו בכל אחריות לנזק ישיר, עקיף, מקרי, תוצאתי או מיוחד הנובע מהשימוש באתר, בהסתמכות על תוצאות החישובים, או מאי-יכולת להשתמש בו. השימוש באתר הוא באחריותו המלאה והבלעדית של המשתמש.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">4. קניין רוחני</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              הקוד, העיצוב, הממשק, הטקסטים והרכיבים הוויזואליים של GlobalCalc Pro מוגנים בחוקי זכויות יוצרים וקניין רוחני.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">5. שינויים בתנאים ובשירות</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              אנו שומרים לעצמנו את הזכות לשנות, לעדכן או להפסיק כל רכיב או שירות באתר בכל עת וללא הודעה מוקדמת.
            </p>
          </section>
        </>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">1. Acceptance of Terms</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              By accessing and using GlobalCalc Pro (globalcalcpro.com), you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900">2. Disclaimers & No Professional Advice</h2>
            <p className="text-stone-600 leading-relaxed text-sm font-semibold">
              All calculators, converters, timelines, and guides on GlobalCalc Pro are intended strictly for educational, informational, and simulation purposes. Under no circumstances should any content or calculation result be construed as professional advice.
            </p>

            <div className="space-y-3 ps-3 border-s-2 border-stone-200">
              <div>
                <h3 className="font-bold text-sm text-stone-900">2.1 No Medical Advice</h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  Health, BMI, water intake, sleep, and pregnancy / due date tools do not provide medical advice, diagnosis, prognosis, or treatment plans. They are not a substitute for clinical judgment or personal consultation with a physician, OB/GYN, midwife, or certified healthcare provider. Always seek the advice of a qualified doctor regarding any medical condition or pregnancy.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-stone-900">2.2 No Financial, Investment, or Mortgage Advice</h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  Financial, amortization, interest, loan, and real estate tools provide mathematical approximations based solely on user inputs. They do not constitute financial planning, investment advice, lending commitments, or tax consulting. Users must independently consult licensed financial advisors, mortgage brokers, and accountants before making financial or contractual commitments.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-stone-900">2.3 No Legal or Tax Advice</h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  Calculators addressing salary, freelance taxes, severance pay, VAT, or depreciation are mathematical simulators and do not constitute formal legal counsel or official tax determinations. Consult a licensed attorney or certified public accountant for legal and statutory compliance.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">3. Limitation of Liability & "AS IS" Warranty</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              GlobalCalc Pro and its creators, operators, and contributors disclaim all warranties, express or implied, including fitness for a particular purpose or numerical precision. In no event shall GlobalCalc Pro be liable for any direct, indirect, incidental, consequential, special, or exemplary damages arising out of the use of, or inability to use, any tool or calculation on this site. Use of this site is entirely at the user's sole risk and discretion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">4. Intellectual Property</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              The software code, layout, design, text, and visual elements of GlobalCalc Pro are protected by applicable intellectual property laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">5. Modifications to Service</h2>
            <p className="text-stone-600 leading-relaxed text-sm">
              We reserve the right to modify, update, or discontinue any feature or service on globalcalcpro.com at any time without prior notice.
            </p>
          </section>
        </>
      )}
    </article>
  );
}
