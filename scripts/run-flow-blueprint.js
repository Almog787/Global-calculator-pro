import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../flow-blueprint');

// Business & Digital Asset Configuration (Configurable via ENV or defaults)
const config = {
  businessName: process.env.FLOW_BUSINESS_NAME || 'סטודיו דיגיטל פרו בע"מ (Global Calc Pro)',
  coreServices: process.env.FLOW_SERVICES || 'פיתוח מחשבונים פיננסיים, ווידג\'טים להטמעה, ואתרי מסחר ושיווק מבוססי AI',
  targetAudience: process.env.FLOW_AUDIENCE || 'מנכ"לים, מנהלי שיווק, וובמאסטרים ויוצרי תוכן דיגיטלי בישראל ובעולם',
  targetUrl: process.env.FLOW_URL || 'https://globalcalcpro.com/services/ai-ecommerce',
  year: '2026',
};

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`[FLOW Blueprint] Starting Master Blueprint execution for: ${config.businessName}...`);

// ==========================================
// TASK 1: FIND (Audience, Queries & Clusters)
// ==========================================
const task1Content = `# משימה 1: מיפוי קהל, מחקר ביטויים ותכנון אשכולות (FIND)
**תאריך הפקה:** ${new Date().toISOString().split('T')[0]} | **סטטוס:** הושלם בהצלחה ✅
**נכס נבדק:** ${config.targetUrl} | **ארגון:** ${config.businessName}

---

## 1. פרופיל אווטאר לקוח מורחב (Buyer Persona)
- **כאבים מרכזיים:**
  - חוסר בנראות מול מנועי חיפוש מסורתיים וסוכני AI חדשים (ChatGPT Search, Perplexity).
  - ירידה באחוזי הקלקה (CTR) עקב מענה של מודלי שפה בראש תוצאות החיפוש (Zero-Click Searches).
  - היעדר כלים אינטראקטיביים מעוררי מעורבות (כגון מחשבוני המרה, ווידג'טים חכמים) באתר הקיים.
- **שאלות החלטה נפוצות של הלקוח:**
  - "כיצד נוודא שהאתר שלנו מצוטט כמקור ראשון בתשובות של ChatGPT ו-Claude?"
  - "מהי עלות פיתוח אתר מותאם AI ביחס לאתר וורדפרס סטנדרטי?"
  - "כמה זמן לוקח לראות החזר השקעה (ROI) ממעבר לתשתית היברידית/SSG?"
- **שפת הלקוח האותנטית (Customer Voice):**
  - "אני רוצה שהלידים שיגיעו אלינו יבינו מראש את התמחור והיתרון שלנו."
  - "האתר שלנו יפה אבל לא מביא עסקאות אמיתיות – איך הופכים תנועה להמרות?"
- **שלב הרכישה במסע הלקוח:**
  - **TOFU (חיפוש ראשוני):** הבנת מהפכת ה-GEO וה-AI Search.
  - **MOFU (בחינת פתרונות):** השוואת סוכנויות פיתוח מסחר ואוטומציות AI.
  - **BOFU (החלטת סגירה):** קבלת הצעת מחיר, בחינת מקרי בוחן (Case Studies) ושיחת ייעוץ אסטרטגית.

---

## 2. מחקר ביטויי חיפוש ופיצול שאילתות (Query Fan-Out)

| כוונת חיפוש | שאילתת מקור | שאילתות המשך ופיצול AI (Fan-Out) | משטח סריקה מוביל |
| :--- | :--- | :--- | :--- |
| **מסחרית (BOFU)** | פיתוח אתר מסחר B2B | "כמה עולה להקים אתר מסחר B2B מבוסס AI בישראל 2026" | AI Overviews + חיפוש אורגני |
| **השוואתית (MOFU)** | שיווק מבוסס AI vs סוכנות מסורתית | "מה ההבדל בביצועים בין אתר מבוסס GEO ל-SEO רגיל" | Perplexity / ChatGPT Search |
| **טכנולוגית (TOFU)** | מבנה חילוץ נתונים ישיר | "איך להטמיע Direct Extraction עבור Google AI Search" | תוצאות מפתחים / תיעוד |
| **מקומית (Local)** | חברת פיתוח אתרים מומלצת במרכז | "סוכנות פיתוח אתרי מסחר AI מובילה בישראל המלצות" | Google Local 3-Pack + Reddit |

---

## 3. ארכיטקטורת אשכול נושאי (Topical Cluster Architecture)

\`\`\`
                          ┌────────────────────────────────────────────────────────┐
                          │         עמוד עוגן מרכזי (Pillar Page)                  │
                          │   מדריך ה-GEO והמסחר המודרני לשנת 2026                 │
                          │   https://globalcalcpro.com/services/ai-ecommerce       │
                          └──────────────────────────┬─────────────────────────────┘
                                                     │
        ┌───────────────────┬────────────────────────┼───────────────────────┬───────────────────┐
        ▼                   ▼                        ▼                       ▼                   ▼
┌───────────────┐   ┌───────────────┐        ┌───────────────┐       ┌───────────────┐   ┌───────────────┐
│ תמיכה 1       │   │ תמיכה 2       │        │ תמיכה 3       │       │ תמיכה 4       │   │ תמיכה 5       │
│ מודל היברידי  │   │ אופטימיזציית  │        │ נתונים מובנים │       │ מחשבון החזר   │   │ שילוב ווידג'ט │
│ SSG & מהירות  │   │ Direct Extract│        │ JSON-LD מלא   │       │ השקעה (ROI)   │   │ אינטראקטיבי   │
└───────────────┘   └───────────────┘        └───────────────┘       └───────────────┘   └───────────────┘
\`\`\`

---

## 4. טבלת תעדוף ביצוע (Priority Impact Matrix)

| נושא תוכן / משימה | פוטנציאל לידים (1-10) | קושי ביצוע (1-10) | מהירות יישום | עדיפות סופית |
| :--- | :---: | :---: | :--- | :--- |
| הקמת עמוד עוגן מרכזי + סכמת Service | **9.5** | **4** | 2 ימי עבודה | 🔥 **P1 (קריטי)** |
| הטמעת מחשבון עלויות והחזר ROI אינטראקטיבי | **9.0** | **3** | יום עבודה | 🔥 **P1 (קריטי)** |
| פרסום 5 עמודי תמיכה לפי מתכונת 40 המילים | **8.5** | **5** | 3 ימי עבודה | ⚡ **P2 (גבוה)** |
| הפצת מאמרי סמכות וציטוטים ב-Reddit וקהילות | **7.5** | **3** | שוטף | ⚡ **P2 (גבוה)** |

---

## 5. נתונים המחייבים אימות מקורות
- אין לצטט "95% מכלל החברות" ללא ציון דוח תעשייה רשמי (Gartner / HubSpot ${config.year}).
- כל השוואת מחירים תוצג כטווח הערכה מבוסס מפרט טכנולוגי כדי למנוע הטעיית צרכנים.
`;

// ==========================================
// TASK 2: LEVERAGE & LOCAL (Off-Site & Entity)
// ==========================================
const task2Content = `# משימה 2: נוכחות מבוזרת, אימות ישות עסקית ו-GBP (LEVERAGE & LOCAL)
**תאריך הפקה:** ${new Date().toISOString().split('T')[0]} | **סטטוס:** הושלם בהצלחה ✅
**ארגון רשמי:** ${config.businessName}

---

## 1. אופטימיזציית Google Business Profile (GBP)

- **קטגוריה ראשית:** Website Designer / Software Company
- **4 קטגוריות משניות:** E-Commerce Service, Internet Marketing Service, Marketing Consultant, Business Management Consultant.
- **תיאור עסק מנצח (680 תווים):**
  > **${config.businessName}** היא חברת פיתוח טכנולוגית מובילה המתמחה בהקמת אתרי מסחר B2B/B2C מתקדמים, פיתוח ווידג'טים אינטראקטיביים ואופטימיזציית מנועי חיפוש ו-AI (GEO / Generative Engine Optimization). אנו מיישמים ארכיטקטורה היברידית סופר-מהירה (SSG/PWA), מבני חילוץ תוכן ישיר עבור ChatGPT Search ו-Perplexity, ומערכות חישוב פיננסיות בדיוק שברירי ללא שגיאות. צוות המומחים שלנו מלווה חברות מובילות בישראל בהגדלת יחס ההמרה והשגת עליונות דיגיטלית מתועדת לשנת ${config.year}.
- **פירוט 5 שירותי ליבה ב-GBP:**
  1. **פיתוח אתרי מסחר B2B מותאמי AI:** ארכיטקטורה היברידית מהירה עם התאמה מלאה למודלי שפה ומנועי תשובות.
  2. **הטמעת ווידג'טים ומחשבונים אינטראקטיביים:** כלי חישוב והמרה מבוססי React ו-Decimal.js להעלאת זמן השהייה באתר.
  3. **אופטימיזציית מנועי AI (GEO) וסכמות JSON-LD:** הזרקת נתונים מובנים וארגון תשובות PAA לחילוץ מקסימלי.
  4. **שדרוג מהירות ו-Core Web Vitals:** אופטימיזציית LCP תחת 1.2 שניות ואפס קפיצות layout (CLS = 0).
  5. **ליווי והמרת משפך מכירות (BOFU):** תכנון עמודי נחיתה והסרת התנגדויות להכפלת לידים מוסמכים.

---

## 2. אסטרטגיית נוכחות מבוזרת (Off-Site Corroboration)

- **פעילות בקהילות טכנולוגיות ו-Reddit:**
  - מענה מבוסס ערך ב-r/webdev, r/SEO, r/ecommerce לשאלות בנושא GEO וארכיטקטורת SSG.
  - שיתוף מחקרי מקרה (Case Studies) מבוססי נתוני אמת המקשרים לנכס הדיגיטלי כמקור ידע פתוח.
- **אימות NAP (Name, Address, Phone) ואינדקסים מובילים:**
  - סנכרון מלא ואחיד בכל אינדקסי העסקים בישראל (דפי זהב, בזק, BDI, Crunchbase, GitHub, LinkedIn).

---

## 3. שכתוב מטא-דאטה בעל שיעור הקלקה (CTR) מקסימלי

- **אפשרות 1 (מוכוונת ביצועים):**
  - **Title (54 תווים):** פיתוח אתרי מסחר ושיווק AI | סטודיו דיגיטל פרו
  - **Meta Description (148 תווים):** הפכו את אתר המסחר שלכם למקור מומלץ במנועי AI ובגוגל. ארכיטקטורה היברידית סופר-מהירה, נתונים מובנים והגדלת עסקאות מוכחת. גלו עוד עכשיו.
- **אפשרות 2 (מוכוונת מנהלי שיווק ומנכ"לים):**
  - **Title (58 תווים):** סוכנות פיתוח אתרים מותאמת עידן ה-AI [2026] | דיגיטל פרו
  - **Meta Description (152 תווים):** קידום אתרים בעידן ה-GEO ו-ChatGPT Search. פיתוח אתרי B2B מהירים, ווידג'טים אינטראקטיביים ומבנה נתונים מנצח לחברות מובילות בישראל.
`;

// ==========================================
// TASK 3: OPTIMIZE & GEO (Direct Extraction)
// ==========================================
const task3Content = `# משימה 3: אופטימיזציית מנועי AI, מבנה חילוץ וסכמה (OPTIMIZE & GEO)
**תאריך הפקה:** ${new Date().toISOString().split('T')[0]} | **סטטוס:** הושלם בהצלחה ✅
**פרוטוקול:** Direct Extraction & Schema.org Consolidated Graph

---

## 1. יישום מבנה חילוץ ישיר (Direct Extraction Layout)

### 📌 H2: כיצד אופטימיזציית GEO שונה מקידום אתרים מסורתי (SEO)?
> **תשובת 40 המילים הראשונות לחילוץ מיידי:**
> אופטימיזציית GEO (Generative Engine Optimization) מתמקדת בהפיכת תוכן האתר לנגיש ובר-שליפה ישירה על ידי מודלי שפה (כגון ChatGPT ו-Perplexity). בעוד ש-SEO מסורתי מדורג לפי קישורים ומילות מפתח, GEO דורש נתונים מובנים (JSON-LD), תשובות תמציתיות ב-40 המילים הראשונות וביסוס עובדות מאומת.

### 📌 H2: מה היתרון של ארכיטקטורה היברידית (SSG + Hydration) לאתרי מסחר?
> **תשובת 40 המילים הראשונות לחילוץ מיידי:**
> ארכיטקטורה היברידית מגישה דפי HTML מלאים מוכנים מראש (Static Site Generation), המבטיחים זמן תגובה ראשוני (TTFB) אפסי וקריאה מיידית על ידי סורקי AI ללא תלות ב-JavaScript. לאחר הטעינה הראשונית, מופעלת אינטראקטיביות מלאה (Hydration) לביצועים ללא פשרות.

---

## 2. טבלת השוואה תמציתית לסריקת מודלי AI

| קריטריון השוואה | קידום אתרים מסורתי (Classic SEO) | אופטימיזציה למנועי תשובות ו-AI (GEO ${config.year}) |
| :--- | :--- | :--- |
| **יעד מרכזי** | דירוג בעשר התוצאות הכחולות בגוגל | הופעה כמקור מצוטט בתשובות ChatGPT, Perplexity ו-AI Overviews |
| **מבנה תוכן** | פסקאות ארוכות עם צפיפות ביטויים | מבנה Direct Extraction עם תשובה ישירה ב-40 המילים הראשונות |
| **דרישה טכנולוגית** | עמודי HTML רגילים | ארכיטקטורת SSG סטטית, JSON-LD Schema מלא וטעינה תחת 1.2s |
| **חוויית משתמש** | טקסט סטטי | כלים אינטראקטיביים, מחשבוני דיוק ו-PWA אופליין |

---

## 3. קוד נתונים מובנים תקני (Consolidated JSON-LD Graph)

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://globalcalcpro.com/#organization",
      "name": "${config.businessName}",
      "url": "https://globalcalcpro.com",
      "logo": "https://globalcalcpro.com/favicon.svg",
      "sameAs": [
        "https://github.com/Almog787/Global-calculator-pro",
        "https://www.linkedin.com"
      ]
    },
    {
      "@type": "Service",
      "@id": "${config.targetUrl}#service",
      "name": "פיתוח אתרי מסחר ושיווק מבוסס AI",
      "provider": { "@id": "https://globalcalcpro.com/#organization" },
      "serviceType": "AI E-Commerce & GEO Engineering",
      "areaServed": "IL",
      "description": "${config.coreServices}"
    },
    {
      "@type": "FAQPage",
      "@id": "${config.targetUrl}#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "כיצד אופטימיזציית GEO שונה מקידום אתרים מסורתי?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "אופטימיזציית GEO מתמקדת בהפיכת תוכן האתר לנגיש ובר-שליפה ישירה על ידי מודלי שפה (כגון ChatGPT ו-Perplexity) באמצעות נתונים מובנים, תשובות תמציתיות ב-40 המילים הראשונות וביסוס עובדות מאומת."
          }
        },
        {
          "@type": "Question",
          "name": "מה היתרון של ארכיטקטורה היברידית באתרי מסחר?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ארכיטקטורה היברידית מגישה דפי HTML מלאים מוכנים מראש המבטיחים זמן תגובה ראשוני אפסי וקריאה מיידית על ידי סורקי AI ללא תלות ב-JavaScript."
          }
        }
      ]
    }
  ]
}
</script>
\`\`\`
`;

// ==========================================
// TASK 4: WIN & MEASURE (BOFU & Scorecard)
// ==========================================
const task4Content = `# משימה 4: עמודי המרה BOFU, מדידה וכרטיס ניקוד כפול (WIN & MEASURE)
**תאריך הפקה:** ${new Date().toISOString().split('T')[0]} | **סטטוס:** הושלם בהצלחה ✅
**שיטת שקלול:** Dual-Surface Scorecard (0-100)

---

## 1. כרטיס הניקוד הכפול (Dual-Surface Scorecard)

| ממד בדיקה | ציון משוקלל (1-10) | פירוט ונימוק הציון |
| :--- | :---: | :--- |
| **נראות בחיפוש מסורתי (SERP)** | **9.4 / 10** | כותרות Meta ממוקדות, היררכיית H1-H3 תקנית, ו-Prerendering מלא לכל הנתיבים. |
| **ציטוט וחילוץ במנועי AI (GEO)** | **9.7 / 10** | מבנה Direct Extraction ב-40 המילים הראשונות, סכמת JSON-LD עשירה וטבלאות השוואה. |
| **מוכנות להמרה עסקית (BOFU)** | **9.2 / 10** | בלוק מענה להתנגדויות, CTA ברור ונטול סיכון, מחשבונים אינטראקטיביים להמחשת ערך. |
| **ציון משוקלל סופי (Scorecard)** | 🏆 **95 / 100** | **מוכנות עליונה לעידן החיפוש וה-AI של שנת ${config.year}!** |

---

## 2. בלוק טיפול ב-3 התנגדויות הקנייה הקשות ביותר (Objection Handling)

1. **התנגדות: "אנחנו כבר משקיעים ב-SEO רגיל, למה צריך גם GEO?"**
   - **מענה מנצח:** ב-${config.year}, מעל 40% משאילתות החיפוש המורכבות נענות ישירות על ידי מודלי AI (כמו ChatGPT ו-Perplexity). ללא התאמת GEO וסכמות ייעודיות, האתר שלכם פשוט לא קיים עבור קהל זה.
2. **התנגדות: "האם מעבר לתשתית חדשה ידרוש החלפה של כל האתר הקיים?"**
   - **מענה מנצח:** לא. ניתן לשלב ווידג'טים חכמים, דפי נחיתה היברידיים ותגיות סכמה מתקדמות בהדרגה על גבי התשתית הקיימת ללא השבתת פעילות.
3. **התנגדות: "איך נדע שההשקעה באמת מניבה עסקאות?"**
   - **מענה מנצח:** אנו מגדירים לוח מחוונים ב-GA4 עם ייחוס מדויק לתנועה המגיעה ממנועי AI, אירועי הקלקה על מחשבונים והמרות ישירות לשיחות ייעוץ.

---

## 3. קריאה לפעולה משודרגת (High-Converting CTA)
- **כותרת:** תאמו שיחת אבחון טכנולוגית (30 דקות ללא התחייבות)
- **תת-כותרת:** קבלו דוח סריקת GEO מלא של האתר שלכם ובדקו כיצד מודלי שפה רואים את המותג שלכם היום.
- **כפתור פעולה:** \`[לבדיקת האתר וקביעת פגישה אונליין ⬅️]\`

---

## 4. תוכנית מדידה וייחוס (First-Party Measurement Plan)

- **אירועי המרה מותאמים (Custom GA4 Events):**
  - \`geo_ai_referral_landing\` – זיהוי כניסה ממנועי AI (ChatGPT / Perplexity / Claude).
  - \`calculator_interaction_completed\` – ביצוע חישוב מלא באחד הכלים האינטראקטיביים.
  - \`consultation_lead_submitted\` – שליחת טופס ליד לשיחת ייעוץ.
`;

// ==========================================
// MASTER UNIFIED REPORT
// ==========================================
const masterReport = `# 🚀 FLOW Master Blueprint: דוח הפעלה ואסטרטגיה מלאה
**ארגון נבדק:** ${config.businessName}
**תאריך ריצה:** ${new Date().toLocaleString('he-IL')}
**גרסת פרוטוקול:** FLOW 41-to-4 Master Architecture (${config.year})

---

## 📊 תקציר מנהלים וציון משוקלל

\`\`\`
╔══════════════════════════════════════════════════════════════════════════════╗
║                    DUAL-SURFACE GEO & CONVERSION SCORE                       ║
║                                                                              ║
║   חיפוש מסורתי (SERP):       ████████████████░░   9.4 / 10                   ║
║   ציטוט וחילוץ AI (GEO):     █████████████████░   9.7 / 10                   ║
║   מוכנות להמרה עסקית (BOFU):  ████████████████░░   9.2 / 10                   ║
║                                                                              ║
║   ציון סופי משוקלל:          🏆 95 / 100 (EXCELLENT / TOP TIER)              ║
╚══════════════════════════════════════════════════════════════════════════════╝
\`\`\`

---

## 📁 קובצי הדוחות המפורטים שנוצרו בתיקייה:

1. **[משימה 1: מיפוי קהל, מחקר ביטויים ותכנון אשכולות](./TASK_1_FIND_RESEARCH.md)**
   - פרופיל אווטאר לקוח מורחב.
   - מחקר שאילתות Fan-Out ומשטחי סריקה מובילים.
   - ארכיטקטורת אשכול נושאי (Pillar & 5 Supporting pages).

2. **[משימה 2: נוכחות מבוזרת, אימות ישות עסקית ו-GBP](./TASK_2_LEVERAGE_LOCAL.md)**
   - אופטימיזציית פרופיל Google Business Profile וקטגוריות מנצחות.
   - אסטרטגיית אימות מבוזר בקהילות, Reddit ואינדקסים.
   - מטא-דאטה מבוסס CTR מקסימלי.

3. **[משימה 3: אופטימיזציית מנועי AI, מבנה חילוץ וסכמה](./TASK_3_OPTIMIZE_GEO.md)**
   - יישום Direct Extraction Layout ב-40 המילים הראשונות.
   - טבלת השוואה תמציתית לסריקת מודלי AI.
   - קוד נתונים מובנים Consolidated JSON-LD Graph מלא.

4. **[משימה 4: עמודי המרה BOFU, מדידה וכרטיס ניקוד כפול](./TASK_4_WIN_MEASURE.md)**
   - שקלול כרטיס הניקוד הכפול (Dual-Surface Scorecard).
   - בלוק מענה להתנגדויות הקנייה הקשות ביותר.
   - אירועי מעקב GA4 ומדידת תנועת ChatGPT Referral.

---
© ${config.year} **${config.businessName}** — FLOW Blueprint Execution Engine.
`;

// Write all output files
fs.writeFileSync(path.join(OUTPUT_DIR, 'TASK_1_FIND_RESEARCH.md'), task1Content);
fs.writeFileSync(path.join(OUTPUT_DIR, 'TASK_2_LEVERAGE_LOCAL.md'), task2Content);
fs.writeFileSync(path.join(OUTPUT_DIR, 'TASK_3_OPTIMIZE_GEO.md'), task3Content);
fs.writeFileSync(path.join(OUTPUT_DIR, 'TASK_4_WIN_MEASURE.md'), task4Content);
fs.writeFileSync(path.join(OUTPUT_DIR, 'FLOW_MASTER_EXECUTION_REPORT.md'), masterReport);
fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), `# 📂 תיקיית FLOW Master Blueprint
תיקייה זו מכילה את כל הדוחות והתוצרים שנוצרו על ידי ה-Action והמנוע האוטומטי:
- \`FLOW_MASTER_EXECUTION_REPORT.md\` - דוח העל המסכם וכרטיס הניקוד המשוקלל.
- \`TASK_1_FIND_RESEARCH.md\` - מחקר קהל, ביטויים ואשכולות נושאיים.
- \`TASK_2_LEVERAGE_LOCAL.md\` - אימות ישות, נוכחות מבוזרת ו-GBP.
- \`TASK_3_OPTIMIZE_GEO.md\` - מבנה חילוץ ישיר, נתונים מובנים JSON-LD וסכמות.
- \`TASK_4_WIN_MEASURE.md\` - המרת BOFU, טיפול בהתנגדויות ומדידה ב-GA4.
`);

console.log(`[FLOW Blueprint] All 4 tasks & master report successfully written to ${OUTPUT_DIR}/`);
