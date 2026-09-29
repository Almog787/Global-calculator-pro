import React from 'react';
import { ShieldAlert, AlertTriangle, Scale, Info } from 'lucide-react';
import { useI18n } from '../contexts/i18n';

export type DisclaimerType = 'medical' | 'financial' | 'legal' | 'general';

interface DisclaimerNoticeProps {
  type?: DisclaimerType;
  className?: string;
  compact?: boolean;
}

export default function DisclaimerNotice({
  type = 'general',
  className = '',
  compact = false,
}: DisclaimerNoticeProps) {
  const { lang } = useI18n();

  const content = {
    medical: {
      title: {
        he: 'הבהרה רפואית חשובה',
        en: 'Important Medical Disclaimer',
        es: 'Aviso Médico Importante',
        fr: 'Avertissement Médical Important',
        ar: 'إخلاء مسؤولية طبي هام',
      },
      text: {
        he: 'מחשבון זה, תוצאותיו והנתונים המוצגים בו נועדו למטרות הערכה, לימוד ומידע כללי בלבד. אין לראות בתוצאות בשום אופן אבחון רפואי, חוות דעת קלינית או תחליף להתייעצות אישית עם רופא/ת מוסמך/ת. בכל שאלה, הריון, תסמינים או החלטה רפואית יש לפנות תמיד לגורם רפואי מוסמך.',
        en: 'This tool, its estimations, and developmental milestones are provided strictly for educational and informational purposes. They do not constitute medical advice, diagnosis, or clinical guidance. Always consult a qualified physician, OB/GYN, or healthcare provider for all medical decisions and care.',
        es: 'Esta herramienta y sus resultados se ofrecen exclusivamente con fines educativos e informativos. No constituyen asesoramiento médico, diagnóstico ni criterio clínico. Consulte siempre a un médico o profesional de la salud cualificado.',
        fr: 'Cet outil et ses estimations sont fournis exclusivement à des fins éducatives et informatives. Ils ne constituent pas un avis médical, un diagnostic ou un suivi clinique. Consultez toujours un médecin ou professionnel de santé qualifié.',
        ar: 'هذه الأداة ونتائجها مقدمة لأغراض تعليمية وإعلامية عامة فقط، ولا تشكل استشارة طبية أو تشخيصاً أو توجيهاً علاجياً. يُرجى دائماً مراجعة طبيב مختص أو جهة رعاية صحية معتمدة.',
      },
      icon: ShieldAlert,
      bg: 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    financial: {
      title: {
        he: 'הבהרה כלכלית ופיננסית חשובה',
        en: 'Important Financial & Mortgage Disclaimer',
        es: 'Aviso Financiero e Hipotecario',
        fr: 'Avertissement Financier & Immobilier',
        ar: 'إخلاء مسؤولية مالي وعقاري هام',
      },
      text: {
        he: 'החישובים, התרחישים והתוצאות המוצגים באתר נועדו למטרות סימולציה, הערכה ולימוד בלבד, ואינם מהווים ייעוץ השקעות, ייעוץ משכנתאות, ייעוץ פיננסי או ייעוץ מס. אין להסתמך על נתונים אלו לביצוע התחייבות כספית כלשהי ויש להיוועץ באנשי מקצוע מורשים (יועץ משכנתאות, יועץ השקעות או רואה חשבון) לפני קבלת החלטות.',
        en: 'Calculations, interest rates, and figures presented are for simulation and estimation purposes only. They do not constitute financial, investment, mortgage, tax, or legal advice. Consult certified financial advisors, mortgage brokers, or accountants before making any financial commitments.',
        es: 'Los cálculos y estimaciones son únicamente para simulación y educación. No constituyen asesoramiento financiero, de inversión, hipotecario ni fiscal. Consulte a asesores certificados antes de comprometerse financieramente.',
        fr: 'Les calculs et estimations sont fournis uniquement à titre de simulation indicative et éducative. Ils ne constituent pas un conseil en investissement, fiscal ou financier. Consultez un conseiller agréé avant tout engagement.',
        ar: 'الحسابات والمحاكاة المعروضة هي لأغراض تقديرية وتعليمية فقط، ولا تشكل استشارة مالية أو استثمارية أو عقارية أو ضريبية. استشر مستشاراً مالياً معتمداً قبل اتخاذ أي التزام مالي.',
      },
      icon: AlertTriangle,
      bg: 'bg-blue-50/80 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 text-blue-950 dark:text-blue-200',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    legal: {
      title: {
        he: 'הבהרה משפטית חשובה',
        en: 'Important Legal Disclaimer',
        es: 'Aviso Legal Importante',
        fr: 'Avertissement Juridique Important',
        ar: 'إخلاء مسؤولية قانوني هام',
      },
      text: {
        he: 'התכנים, החישובים והכלים באתר (לרבות חישובי פיצויי פיטורין, חוזים, שכר וזכויות עובדים) אינם מהווים ייעוץ משפטי ואינם תחליף לייעוץ פרטני עם עורך דין מוסמך. השימוש באתר הוא באחריות המשתמש בלבד.',
        en: 'All information, calculations, and formulas provided (including severance, contract, or labor estimates) do not constitute legal advice and cannot replace tailored legal counsel from a licensed attorney.',
        es: 'Toda la información y cálculos (incluidas indemnizaciones laborales o contratos) no constituyen asesoramiento jurídico ni sustituyen la consulta con un abogado profesional.',
        fr: 'Les informations et calculs (notamment indemnités de rupture ou contrats) ne constituent pas un conseil juridique et ne remplacent pas l\'avis d\'un avocat qualifié.',
        ar: 'المعلومات والحسابات المقدمة (بما فيها مكافأة نهاية الخدمة وعقود العمل) لا تشكل استشارة قانونية ولا تغني عن استشارة محامٍ مرخص.',
      },
      icon: Scale,
      bg: 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-300',
      iconColor: 'text-stone-600 dark:text-stone-400',
    },
    general: {
      title: {
        he: 'הבהרה כללית',
        en: 'General Disclaimer',
        es: 'Aviso General',
        fr: 'Avertissement Général',
        ar: 'إخلاء مسؤولية عام',
      },
      text: {
        he: 'כל החישובים, הנוסחאות והכלים באתר מסופקים ככלי עזר טכני למטרות מידע כללי והערכה בלבד ללא כל אחריות. השימוש במידע ובתוצאות נעשה על אחריותו הבלעדית של המשתמש.',
        en: 'All calculations, formulas, and tools on this website are provided as technical estimation aids for general informational purposes only without warranty of any kind. Use is at your own discretion and risk.',
        es: 'Todos los cálculos y fórmulas se proporcionan como herramientas de ayuda técnica con fines informativos y sin garantía. El uso es bajo su propia responsabilidad.',
        fr: 'Tous les calculs et formules sont fournis à titre d\'aide technique indicative sans garantie d\'aucune sorte. L\'utilisation s\'effectue à vos propres risques.',
        ar: 'جميع الحسابات والمعادلات مقدمة كأدوات مساعدة لأغراض إعلامية عامة دون أي ضمانات، واستخدامها يقع على مسؤولية المستخدم الخاصة.',
      },
      icon: Info,
      bg: 'bg-surface-container-low border-border-subtle text-on-surface-variant',
      iconColor: 'text-on-surface-variant',
    },
  };

  const item = content[type] || content.general;
  const Icon = item.icon;
  const titleText = item.title[lang] || item.title.en;
  const bodyText = item.text[lang] || item.text.en;

  if (compact) {
    return (
      <div
        className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${item.bg} ${className}`}
        role="note"
      >
        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${item.iconColor}`} />
        <div>
          <span className="font-bold me-1">{titleText}:</span>
          <span>{bodyText}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-xs ${item.bg} ${className}`}
      role="note"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${item.iconColor}`} />
      <div className="space-y-1">
        <h4 className="font-bold tracking-tight text-xs uppercase opacity-90">
          {titleText}
        </h4>
        <p className="opacity-95 leading-relaxed text-xs sm:text-xs">
          {bodyText}
        </p>
      </div>
    </div>
  );
}
