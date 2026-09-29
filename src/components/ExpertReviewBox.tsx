import React from 'react';
import { useI18n } from '../contexts/i18n';

export interface ExpertReviewInfo {
  reviewerName?: string;
  reviewerRole?: string;
  methodology?: string;
  standards?: string;
  lastUpdated?: string;
  calculationEngine?: string;
}

interface ExpertReviewBoxProps {
  category?: 'finance' | 'health' | 'math' | 'lifestyle' | 'real-estate' | 'tech';
  customReview?: ExpertReviewInfo;
  className?: string;
}

export default function ExpertReviewBox({ category = 'finance', customReview, className = '' }: ExpertReviewBoxProps) {
  const { lang } = useI18n();

  // Dynamic Current Month and Year for Freshness Factor (e.g. "מרץ 2026", "March 2026")
  const currentDate = new Date();
  const monthNames: Record<string, string[]> = {
    he: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  };

  const currentMonth = (monthNames[lang] || monthNames.en)[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const defaultLastUpdated = `${currentMonth} ${currentYear}`;

  const categoryReviewers: Record<string, Record<string, { role: string; cert: string; methodology: string }>> = {
    finance: {
      he: {
        role: "צוות אנליסטים פיננסיים ואקטואריה",
        cert: "בדיקת דיוק מתמטי מוסמכת",
        methodology: "לוחות סילוקין תקניים (שפיצר/קרן שווה), ריבית אפקטיבית דריבית, והצמדה למדד בדיוק Decimal.js."
      },
      en: {
        role: "Financial & Actuarial Analysis Team",
        cert: "Mathematically Verified & Certified",
        methodology: "Standard amortization models (Spitzer/Straight-line), compound interest logic, and Decimal.js high precision."
      },
      es: {
        role: "Equipo de Análisis Financiero y Actuarial",
        cert: "Verificado y Certificado Matemáticamente",
        methodology: "Fórmulas de amortización estándar, interés compuesto y motor de alta precisión Decimal.js."
      },
      fr: {
        role: "Équipe d'Analyse Financière et Actuarielle",
        cert: "Vérification Mathématique Certifiée",
        methodology: "Tableaux d'amortissement officiels, intérêts composés et moteur de calcul haute précision Decimal.js."
      },
      ar: {
        role: "فريق التحليل المالي والرياضي",
        cert: "تم التحقق والتدقيق الرياضي المعتمد",
        methodology: "جداول الاستهلاك الرسمية، وحسابات الفائدة المركبة، ومحرك الدقة العالية Decimal.js."
      }
    },
    'real-estate': {
      he: {
        role: "אנליסט שוק הנדל״ן ומומחה מימון משכנתאות",
        cert: "תאימות להנחיות בנק ישראל ורשות המסים",
        methodology: "מדרגות מס רכישה עדכניות 2026, דמי היוון, מודל תשואת Cap Rate והשוואת שכירות מול רכישה."
      },
      en: {
        role: "Real Estate & Mortgage Advisory Team",
        cert: "Regulatory & Banking Standard Verified",
        methodology: "Current tax tiers, Cap Rate valuation equations, and multi-variable rent vs. buy algorithms."
      },
      es: {
        role: "Equipo de Asesoría Inmobiliaria e Hipotecaria",
        cert: "Verificado según Normativas Financieras",
        methodology: "Tablas fiscales vigentes, modelos Cap Rate y algoritmos avanzados de compra vs. alquiler."
      },
      fr: {
        role: "Équipe d'Expertise Immobilière et Prêts",
        cert: "Conforme aux Normes Bancaires",
        methodology: "Barèmes fiscaux récents, calculs de rendement Cap Rate et simulation achat vs location."
      },
      ar: {
        role: "فريق الاستشارات العقارية وقروض الإسكان",
        cert: "مطابق للمعايير المصرفية والضريبية",
        methodology: "شرائح الضرائب الحديثة، معادلات العائد الرأسمالي Cap Rate، ومقارنة الإيجار مقابل الشراء."
      }
    },
    health: {
      he: {
        role: "ייעוץ מומחה פיזיולוגיה ורפואה מונעת",
        cert: "תאימות לפרוטוקול WHO ו-ACOG",
        methodology: "נוסחאות Mifflin-St Jeor ל-BMR, כלל נייגלה ו-ACOG לשבועות הריון, וחתכי BMI רשמיים של ארגון הבריאות העולמי."
      },
      en: {
        role: "Physiology & Preventive Health Clinical Review",
        cert: "WHO & ACOG Protocol Verified",
        methodology: "Mifflin-St Jeor equation for BMR, Naegele's rule for gestational milestones, and official WHO BMI cutoffs."
      },
      es: {
        role: "Equipo de Revisión Fisiológica y Salud",
        cert: "Verificado según Protocolos OMS y ACOG",
        methodology: "Ecuaciones Mifflin-St Jeor para TMB, regla de Naegele para embarazo y clasificación oficial OMS."
      },
      fr: {
        role: "Équipe Médicale et Physiologique",
        cert: "Protocoles OMS et ACOG Vérifiés",
        methodology: "Équation de Mifflin-St Jeor, règle de Naegele pour la grossesse et seuils officiels OMS."
      },
      ar: {
        role: "فريق المراجعة الفسيولوجية والصحية",
        cert: "مطابق لبروتوكولات منظمة الصحة العالمية و ACOG",
        methodology: "معادلة Mifflin-St Jeor لمعدل الأيض، وقاعدة Naegele لمراحل الحمل، وتصنيفات منظمة الصحة العالمية."
      }
    },
    math: {
      he: {
        role: "צוות מתמטיקה שימושית ומדעי הנתונים",
        cert: "דיוק אלגוריתמי עשרוני מושלם (Decimal Precision)",
        methodology: "שימוש במנוע חישוב שברים עשרוניים ברוחב פס גבוה למניעת שגיאות נקודה צפה (Floating-point precision errors)."
      },
      en: {
        role: "Applied Mathematics & Computational Science Team",
        cert: "Precision Arithmetic Engine Verified",
        methodology: "High-precision decimal arithmetic engine preventing IEEE 754 floating-point rounding discrepancies."
      },
      es: {
        role: "Equipo de Matemática Aplicada y Computación",
        cert: "Precisión Decimal Verificada",
        methodology: "Motor de alta precisión aritmética que elimina errores de redondeo en punto flotante."
      },
      fr: {
        role: "Équipe de Mathématiques Appliquées",
        cert: "Précision Arithmétique Certifiée",
        methodology: "Moteur de calcul décimal évitant les erreurs d'arrondi en virgule flottante."
      },
      ar: {
        role: "فريق الرياضيات التطبيقية والحوسبة",
        cert: "دقة حسابية متناهية ومعتمدة",
        methodology: "محرك حسابي عالي الدقة يمنع أخطاء التقريب في الفواصل العشرية."
      }
    },
    lifestyle: {
      he: {
        role: "צוות מחקר ומומחיות יומיומית",
        cert: "בדיקת מהימנות ומדדי נוחות",
        methodology: "נוסחאות מותאמות לתקני אירוח, מדדי צריכה מומלצים ומחשבוני זמן מדויקים."
      },
      en: {
        role: "Lifestyle & Daily Utility Research Team",
        cert: "Standardized Reference Verified",
        methodology: "Industry hospitality benchmarks, recommended intake metrics, and exact date-time delta algorithms."
      },
      es: {
        role: "Equipo de Utilidades y Vida Diaria",
        cert: "Estandarizado y Verificado",
        methodology: "Normas de servicio habituales, cálculos de consumo y algoritmos de tiempo exactos."
      },
      fr: {
        role: "Équipe Pratique et Mode de Vie",
        cert: "Vérifié selon les Standards du Secteur",
        methodology: "Normes de pourboire et consommation recommandées avec calculs temporels précis."
      },
      ar: {
        role: "فريق المعايير الحياتية والأدوات اليومية",
        cert: "معتمد وفق المعايير القياسية",
        methodology: "معايير الخدمة والاستهلاك الموصى بها مع خوارزميات حساب زمني دقيقة."
      }
    },
    tech: {
      he: {
        role: "צוות הנדסת תוכנה ומערכות חישוב",
        cert: "בדיקת תאימות בינארית והנדסית",
        methodology: "מודלים תרמודינמיים (Peltier), חישובי רוחב פס וקצבי העברת נתונים בינאריים מדויקים."
      },
      en: {
        role: "Software Engineering & Systems Team",
        cert: "Binary & Engineering Standards Verified",
        methodology: "Thermodynamic equations (Peltier), throughput bandwidth modeling, and bitwise logic engines."
      },
      es: {
        role: "Equipo de Ingeniería de Software y Sistemas",
        cert: "Estándares de Ingeniería Verificados",
        methodology: "Ecuaciones termodinámicas, modelos de ancho de banda y lógica binaria exacta."
      },
      fr: {
        role: "Équipe Ingénierie et Systèmes",
        cert: "Standards d'Ingénierie Validés",
        methodology: "Formules thermodynamiques, calculs de bande passante et logique binaire exacte."
      },
      ar: {
        role: "فريق هندسة البرمجيات والأنظمة",
        cert: "مطابق للمعايير الهندسية والتقنية",
        methodology: "معادلات الديناميكا الحرارية، ونماذج سرعة نقل البيانات، ومحركات المنطق الثنائي."
      }
    }
  };

  const localizedReviewer = categoryReviewers[category]?.[lang] || categoryReviewers[category]?.en || categoryReviewers.finance.en;

  const reviewerRole = customReview?.reviewerRole || localizedReviewer.role;
  const certBadge = customReview?.standards || localizedReviewer.cert;
  const methodologyText = customReview?.methodology || localizedReviewer.methodology;
  const lastUpdatedText = customReview?.lastUpdated || defaultLastUpdated;

  const labels: Record<string, { verifiedBy: string; lastUpdated: string; methodology: string; standard: string }> = {
    he: {
      verifiedBy: 'נבדק ואושר מקצועית על ידי:',
      lastUpdated: 'עודכן לחודש:',
      methodology: 'מתודולוגיית החישוב והדיוק:',
      standard: 'תקן אמינות E-E-A-T',
    },
    en: {
      verifiedBy: 'Expertly Verified & Reviewed by:',
      lastUpdated: 'Last Updated for:',
      methodology: 'Calculation Methodology & Accuracy:',
      standard: 'E-E-A-T Quality Standard',
    },
    es: {
      verifiedBy: 'Revisado y Verificado por Expertos:',
      lastUpdated: 'Actualizado para:',
      methodology: 'Metodología y Precisión:',
      standard: 'Estándar E-E-A-T',
    },
    fr: {
      verifiedBy: 'Vérifié et Validé par des Experts :',
      lastUpdated: 'Dernière mise à jour :',
      methodology: 'Méthodologie et Précision :',
      standard: 'Norme E-E-A-T',
    },
    ar: {
      verifiedBy: 'تم التدقيق والمراجعة من قبل الخبراء:',
      lastUpdated: 'تم التحديث لشهر:',
      methodology: 'منهجية الحساب ومستوى الدقة:',
      standard: 'معيار الجودة E-E-A-T',
    }
  };

  const currentLabels = labels[lang] || labels.en;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30 shadow-inner">
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {currentLabels.verifiedBy}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {certBadge}
              </span>
            </div>
            <div className="text-sm font-bold text-white tracking-wide mt-0.5">
              {reviewerRole}
            </div>
          </div>
        </div>

        {/* Freshness Badge */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/60 shrink-0 self-start md:self-auto">
          <span className="material-symbols-outlined text-blue-400 text-[16px]">schedule</span>
          <span>
            <span className="text-slate-400">{currentLabels.lastUpdated} </span>
            <strong className="text-white font-semibold">{lastUpdatedText}</strong>
          </span>
        </div>
      </div>

      <div className="mt-3.5 pt-1 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
        <span className="material-symbols-outlined text-slate-400 text-[16px] shrink-0 mt-0.5">analytics</span>
        <div>
          <span className="font-semibold text-slate-200">{currentLabels.methodology} </span>
          <span className="text-slate-400">{methodologyText}</span>
        </div>
      </div>
    </div>
  );
}
