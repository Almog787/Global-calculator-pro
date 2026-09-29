import React, { useState, useMemo } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { useI18n } from '../../contexts/i18n';
import { calculatePregnancy, getFetalDataForWeek, FetalWeekData } from '../../lib/math/allCalculators';
import CalculatorGuide from '../../components/CalculatorGuide';
import FAQ from '../../components/FAQ';
import DisclaimerNotice from '../../components/DisclaimerNotice';
import Breadcrumbs from '../../components/Breadcrumbs';
import {
  Baby,
  Calendar,
  Heart,
  Clock,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  Activity,
  Copy,
  Check,
  Scale,
  Ruler,
  Stethoscope,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type CalcMethod = 'lmp' | 'conception' | 'due_date' | 'ivf_day3' | 'ivf_day5';

interface PrenatalMilestone {
  id: string;
  startWeek: number;
  endWeek: number;
  title: Record<string, string>;
  desc: Record<string, string>;
  category: 'routine' | 'screening' | 'ultrasound' | 'birth';
}

const PRENATAL_MILESTONES: PrenatalMilestone[] = [
  {
    id: 'ultrasound_early',
    startWeek: 6,
    endWeek: 8,
    title: {
      he: 'אולטרסאונד ראשון לדופק ומיקום שק ההריון',
      en: 'First Ultrasound (Viability & Heartbeat)',
      es: 'Primera Ecografía (Latido y Viabilidad)',
      fr: 'Première Échographie (Battement & Viabilité)',
      ar: 'أول فحص بالموجات فوق الصوتية (النبض والتأكد من الحمل)',
    },
    desc: {
      he: 'בדיקת אולטרסאונד ראשונית לווידוא שק הריון תוך-רחמי, קיום דופק עוברי וקביעת גיל הריון מדויק.',
      en: 'Initial ultrasound to confirm intrauterine pregnancy, fetal heartbeat, and accurate gestational age.',
      es: 'Ecografía para confirmar implantación intrauterina, latido cardíaco y fecha probable de parto.',
      fr: 'Échographie pour confirmer l\'implantation utérine, l\'activité cardiaque et la datation précise.',
      ar: 'فحص بالسونار للتأكد من وجود كيس الحمل داخل الرحم وسماع نبض الجنين وتحديد العمر بدقة.',
    },
    category: 'ultrasound',
  },
  {
    id: 'nuchal_translucency',
    startWeek: 11,
    endWeek: 13,
    title: {
      he: 'שקיפות עורפית וסקר ביוכימי שליש ראשון',
      en: 'Nuchal Translucency & 1st Trimester Screen',
      es: 'Translucencia Nucal y Cribado del 1er Trimestre',
      fr: 'Clarté Nucale et Dépistage du 1er Trimestre',
      ar: 'فحص قياس شفافية عظم الرقبة ومسح الثلث الأول',
    },
    desc: {
      he: 'מדידת עובי הנוזל בעורף העובר ושילוב בדיקת דם (PAPP-A ו-HCG) להערכת סיכון לתסמונת דאון ומומים כרומוזומליים.',
      en: 'Ultrasound measurement of fluid at baby\'s neck combined with blood tests to evaluate chromosomal risks.',
      es: 'Medición ecográfica del pliegue nucal junto a análisis de sangre para evaluar riesgos cromosómicos.',
      fr: 'Mesure de l\'épaisseur de la clarté nucale combinée à une prise de sang pour évaluer le risque de trisomie.',
      ar: 'قياس سمك السائل خلف رقبة الجنين مع فحص دم لتحديد احتمالية وجود متلازمة داون واضطرابات الكروموسومات.',
    },
    category: 'screening',
  },
  {
    id: 'early_anatomy',
    startWeek: 14,
    endWeek: 16,
    title: {
      he: 'סקירת מערכות מוקדמת',
      en: 'Early Anatomy Ultrasound Scan',
      es: 'Ecografía Morfológica Temprana',
      fr: 'Échographie Morphologique Précoce',
      ar: 'المسح التشريحي المبكر للأعضاء',
    },
    desc: {
      he: 'בדיקת אולטרסאונד מפורטת לבדיקת התפתחות ראשונית של איברי העובר (מוח, לב, כליות, גפיים ועמוד שדרה).',
      en: 'Comprehensive ultrasound evaluation checking early development of baby\'s vital organs and limbs.',
      es: 'Evaluación ecográfica detallada para comprobar la formación de órganos principales y extremidades.',
      fr: 'Examen morphologique approfondi pour vérifier la formation des organes vitaux et des membres.',
      ar: 'فحص تفصيلي بالسونار للتحقق من التطور الأولي لأعضاء الجنين الحيوية والأطراف.',
    },
    category: 'ultrasound',
  },
  {
    id: 'quad_screen_afp',
    startWeek: 16,
    endWeek: 20,
    title: {
      he: 'בדיקת חלבון עוברי (תבחין משולש / מרובע)',
      en: 'Quad Screen / Maternal Serum AFP',
      es: 'Cribado Cuádruple / Alfa-fetoproteína',
      fr: 'Marqueurs Sériques du 2e Trimestre (AFP)',
      ar: 'فحص ألفا فيتو بروتين (المسح الرباعي)',
    },
    desc: {
      he: 'בדיקת דם סטטיסטית הבודקת סיכון למומים במערכת העצבים המרכזית (מוח ועמוד שדרה) ותסמונת דאון.',
      en: 'Blood test measuring maternal proteins to evaluate risk for neural tube defects and genetic anomalies.',
      es: 'Análisis de sangre para evaluar el riesgo de anomalías cromosómicas y defectos del tubo neural.',
      fr: 'Prise de sang mesurant les protéines placentaires pour évaluer les risques d\'anomalies génétiques.',
      ar: 'فحص دم لقياس بروتينات الأم لتقييم احتمالية عيوب الأنبوب العصبي واضطرابات الجينات.',
    },
    category: 'screening',
  },
  {
    id: 'late_anatomy',
    startWeek: 20,
    endWeek: 24,
    title: {
      he: 'סקירת מערכות מאוחרת (סקירה אנטומית מורחבת)',
      en: 'Mid-Pregnancy Detailed Anatomy Scan',
      es: 'Ecografía Morfológica de la Semana 20',
      fr: 'Échographie Morphologique du 2e Trimestre',
      ar: 'المسح التفصيلي لأعضاء الجنين في منتصف الحمل',
    },
    desc: {
      he: 'סקירה יסודית ומעמיקה של כל איברי ומערכות העובר, מיקום השליה וכמות מי השפיר. שיא ההתרגשות לצפייה בתווי הפנים.',
      en: 'In-depth anatomy scan examining all internal organs, brain structures, heart chambers, spine, and placenta.',
      es: 'Estudio exhaustivo de todos los órganos internos, corazón, cerebro, columna vertebral y placenta.',
      fr: 'Examen morphologique complet des organes, des cavités cardiaques, du cerveau et du placenta.',
      ar: 'فحص شامل ودقيق لكافة أعضاء الجنين، حجرات القلب، الدماغ، العمود الفقري وموقع المشيمة.',
    },
    category: 'ultrasound',
  },
  {
    id: 'glucose_tolerance',
    startWeek: 24,
    endWeek: 28,
    title: {
      he: 'העמסת סוכר (GTT 50g) וספירת דם',
      en: 'Glucose Challenge Test (50g GTT) & CBC',
      es: 'Prueba de Tolerancia a la Glucosa (O\'Sullivan)',
      fr: 'Test de Dépistage du Diabète Gestationnel',
      ar: 'فحص سكر الحمل (تحمل الجلوكوز 50 جم)',
    },
    desc: {
      he: 'בדיקת סקירה לאיתור סוכרת הריון וספירת דם לבדיקת המוגלובין ורמות ברזל אצל האם.',
      en: 'Routine screening to detect gestational diabetes and maternal blood counts for iron deficiency anemia.',
      es: 'Prueba para detectar diabetes gestacional y análisis de sangre para prevenir la anemia.',
      fr: 'Dépistage systématique du diabète gestationnel et contrôle de la numération sanguine (fer/hémoglobine).',
      ar: 'فحص روتيني للكشف عن سكري الحمل وفحص دم للكشف عن فقر الدم ونقص الحديد.',
    },
    category: 'routine',
  },
  {
    id: 'growth_scan_tdap',
    startWeek: 28,
    endWeek: 32,
    title: {
      he: 'מעקב גדילה ראשון (הערכת משקל) ומעקב הריון',
      en: '3rd Trimester Growth Scan & Routine Checkup',
      es: 'Control de Crecimiento Fetal y Revisión Prenatal',
      fr: 'Échographie du 3e Trimestre et Suivi de Routine',
      ar: 'متابعة نمو ووزن الجنين والفحص الدوري',
    },
    desc: {
      he: 'אולטרסאונד שגרתי להערכת משקל, קצב גדילה וזרימות דם, לצד מידע כללי על מעקבים מומלצים בהריון לפי הנחיות הרופא המטפל.',
      en: 'Routine ultrasound check for fetal growth and amniotic fluid, along with standard prenatal checkup review with your doctor.',
      es: 'Ecografía de rutina para evaluar percentil de peso y líquido amniótico junto al control prenatal con su médico.',
      fr: 'Échographie de contrôle de croissance et consultation prénatale de routine avec votre praticien.',
      ar: 'فحص بالسونار لتقدير وزن الجنين ونموه ومراجعة الفحوصات الروتينية مع الطبيب المعالج.',
    },
    category: 'routine',
  },
  {
    id: 'gbs_screening',
    startWeek: 35,
    endWeek: 37,
    title: {
      he: 'משטח GBS (סטרפטוקוקוס מקבוצה B)',
      en: 'Group B Strep (GBS) Screening Swab',
      es: 'Cultivo de Estreptococo del Grupo B (GBS)',
      fr: 'Dépistage du Streptocoque B (Prélèvement Vaginal)',
      ar: 'مسحة بكتيريا المكورات العقدية (GBS)',
    },
    desc: {
      he: 'משטח נרתיקי שגרתי לבדיקת נשאות חיידק ה-GBS. במידה וחיובי, יינתן אנטיביוטיקה בלידה להגנה על התינוק.',
      en: 'Routine swab test checking for Group B Streptococcus to determine need for IV antibiotics in labor.',
      es: 'Frotis de rutina para detectar estreptococo del grupo B y prevenir infecciones perinatales en el parto.',
      fr: 'Prélèvement vaginal de routine pour prévenir la transmission néonatale lors de l\'accouchement.',
      ar: 'مسحة روتينية للكشف عن بكتيريا GBS لتحديد الحاجة لمضاد حيوي وقائي أثناء المخاض.',
    },
    category: 'routine',
  },
  {
    id: 'full_term_prep',
    startWeek: 37,
    endWeek: 40,
    title: {
      he: 'הגעה למועד מלא (Full Term) והכנה ללידה',
      en: 'Full Term Milestone & Labor Readiness',
      es: 'Embarazo a Término Completo y Preparto',
      fr: 'Grossesse à Terme et Préparation à l\'Accouchement',
      ar: 'اكتمال نمو الجنين (Full Term) والاستعداد للولادة',
    },
    desc: {
      he: 'העובר בשל לחלוטין לחיים בחוץ! מעקב תנועות עובר סדיר, בדיקת מוכנות צוואר הרחם ואריזת תיק לידה.',
      en: 'Baby is fully formed and ready for the world! Monitoring fetal kicks, signs of labor, and hospital prep.',
      es: '¡El bebé está listo para nacer! Monitoreo de movimientos fetales y preparación de la bolsa del hospital.',
      fr: 'Le bébé est prêt ! Surveillance active des mouvements fœtaux, contractions et départ pour la maternité.',
      ar: 'الجنين مكتمل النمو تماماً وجاهز للولادة! مراقبة حركة الجنين وعلامات المخاض وتجهيز حقيبة الولادة.',
    },
    category: 'birth',
  },
  {
    id: 'post_dates',
    startWeek: 40,
    endWeek: 42,
    title: {
      he: 'מעקב הריון עודף (מוניטור ופרופיל ביופיזיקלי)',
      en: 'Post-Dates Monitoring (NST & Biophysical Profile)',
      es: 'Monitoreo de Embarazo Post-Término (NST)',
      fr: 'Surveillance de Dépassement de Terme (Monitoring)',
      ar: 'متابعة ما بعد الموعد المحدد (تخطيط الجنين والمراقبة)',
    },
    desc: {
      he: 'בדיקות מוניטור עוברי ואולטרסאונד כל 2-3 ימים לווידוא תפקוד השליה, כמות מי שפיר וחיוניות העובר.',
      en: 'Fetal non-stress test (NST) and ultrasound monitoring every 2-3 days to confirm fetal well-being.',
      es: 'Monitorización cardiotocográfica y ecografía cada 48-72h para asegurar el bienestar fetal.',
      fr: 'Enregistrement du rythme cardiaque fœtal (RCF) et échographie tous les 2 jours pour s\'assurer du bien-être.',
      ar: 'متابعة دورية بتخطيط قلب الجنين والسونار كل يومين إلى ثلاثة للتأكد من سلامة الجنين والمشيمة.',
    },
    category: 'birth',
  },
];

export default function PregnancyCalculator() {
  const { lang, t } = useI18n();

  // URL state persistence for bookmarking & sharing
  const [method, setMethod] = useUrlState<CalcMethod>('method', 'lmp');
  
  // Default to 8 weeks ago so first view provides immediate, realistic insight
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 56);
    return d.toISOString().split('T')[0];
  }, []);

  const [dateStr, setDateStr] = useUrlState<string>('date', defaultDate);
  const [cycleLength, setCycleLength] = useUrlState<number>('cycle', 28);
  const [copied, setCopied] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  // Compute calculation results using pure math helper
  const calcResult = useMemo(() => {
    return calculatePregnancy({
      method,
      dateStr,
      cycleLength,
    });
  }, [method, dateStr, cycleLength]);

  const fetalData: FetalWeekData = useMemo(() => {
    return getFetalDataForWeek(calcResult.gestationalWeeks);
  }, [calcResult.gestationalWeeks]);

  // Labels dictionary for multilingual support
  const L = useMemo(() => {
    const dict: Record<string, Record<string, string>> = {
      title: {
        he: 'מחשבון שבועות הריון ותאריך לידה משוער',
        en: 'Pregnancy & Due Date Calculator',
        es: 'Calculadora de Semanas de Embarazo y Fecha de Parto',
        fr: 'Calculateur de Grossesse et Date d\'Accouchement',
        ar: 'حاسبة أسابيع الحمل وموعد الولادة المتوقع',
      },
      subtitle: {
        he: 'חישוב שבוע הריון מדויק, תאריך לידה משוער, טרימסטר נוכחי, ואבני דרך מרכזיות של התפתחות העובר',
        en: 'Calculate your exact gestational age, estimated due date, current trimester, and baby milestones',
        es: 'Calcula semanas de gestación, fecha probable de parto, trimestre e hitos de desarrollo del bebé',
        fr: 'Calculez votre terme exact, la date prévue d\'accouchement, le trimestre et les étapes fœtales',
        ar: 'احسبي أسبوع الحمل الدقيق، موعد الولادة المتوقع، الثلث الحالي ومراحل نمو الجنين خطوة بخطوة',
      },
      methodLmp: {
        he: 'וסת אחרונה (LMP)',
        en: 'Last Period (LMP)',
        es: 'Última Regla (FUM)',
        fr: 'Dernières Règles',
        ar: 'آخر دورة شهرية',
      },
      methodConception: {
        he: 'יום הביוץ / הפריה',
        en: 'Conception / Ovulation',
        es: 'Concepción / Ovulación',
        fr: 'Date de Conception',
        ar: 'تاريخ الإخصاب / التبويض',
      },
      methodDueDate: {
        he: 'תאריך לידה ידוע',
        en: 'Known Due Date',
        es: 'Fecha de Parto Conocida',
        fr: 'Date Prévue d\'Accouchement',
        ar: 'موعد ولادة محدد مسبقاً',
      },
      methodIvf3: {
        he: 'החזרת עוברים (יום 3)',
        en: 'IVF (Day 3 Transfer)',
        es: 'FIV (Transferencia Día 3)',
        fr: 'FIV (Transfert J3)',
        ar: 'أطفال أنابيب (نقل يوم 3)',
      },
      methodIvf5: {
        he: 'החזרת בלסטוציסט (יום 5)',
        en: 'IVF (Day 5 Blastocyst)',
        es: 'FIV (Blastocisto Día 5)',
        fr: 'FIV (Blastocyste J5)',
        ar: 'أطفال أنابيب (بلستوسست يوم 5)',
      },
      dateLabelLmp: {
        he: 'תאריך היום הראשון של הווסת האחרונה:',
        en: 'First day of your last menstrual period (LMP):',
        es: 'Primer día de tu última menstruación:',
        fr: 'Premier jour de vos dernières règles :',
        ar: 'أول يوم من آخر دورة شهرية:',
      },
      dateLabelConception: {
        he: 'תאריך קיום הביוץ או ההפריה המשוערת:',
        en: 'Date of conception or ovulation:',
        es: 'Fecha estimada de concepción u ovulación:',
        fr: 'Date estimée de la conception ou ovulation :',
        ar: 'تاريخ التبويض أو الإخصاب التقديري:',
      },
      dateLabelDueDate: {
        he: 'תאריך הלידה המשוער שנקבע לך (EDD):',
        en: 'Your estimated due date (EDD):',
        es: 'Tu fecha estimada de parto (FPP):',
        fr: 'Votre date présumée d\'accouchement :',
        ar: 'موعد الولادة المتوقع المحدد لكِ:',
      },
      dateLabelIvf: {
        he: 'תאריך החזרת העובר לרחם:',
        en: 'Embryo transfer date:',
        es: 'Fecha de transferencia embrionaria:',
        fr: 'Date du transfert d\'embryon :',
        ar: 'تاريخ نقل الأجنة إلى الرحم:',
      },
      cycleLengthLabel: {
        he: 'אורך מחזור ממוצע (בימים):',
        en: 'Average cycle length (days):',
        es: 'Duración media del ciclo (días):',
        fr: 'Durée moyenne du cycle (jours) :',
        ar: 'متوسط طول الدورة الشهرية (بالأيام):',
      },
      cycleNote: {
        he: 'מחזור סטנדרטי הוא 28 ימים. אם המחזור שלך ארוך או קצר יותר, מועד הביוץ מתעדכן בהתאם.',
        en: 'Standard cycle is 28 days. Ovulation shifts automatically for shorter or longer cycles.',
        es: 'El ciclo estándar es de 28 días. La ovulación se ajusta según la duración del ciclo.',
        fr: 'Le cycle standard est de 28 jours. L\'ovulation s\'adapte à la durée de votre cycle.',
        ar: 'الدورة الطبيعية 28 يوماً، ويتم تعديل موعد التبويض تلقائياً للدورات الأقصر أو الأطول.',
      },
      dueDateTitle: {
        he: 'תאריך לידה משוער (EDD)',
        en: 'Estimated Due Date (EDD)',
        es: 'Fecha Probable de Parto',
        fr: 'Date Prévue d\'Accouchement',
        ar: 'موعد الولادة المتوقع',
      },
      gestationalAgeTitle: {
        he: 'גיל ההריון המדויק',
        en: 'Exact Gestational Age',
        es: 'Edad Gestacional Exacta',
        fr: 'Âge Gestationnel Précis',
        ar: 'عمر الحمل الدقيق',
      },
      trimesterTitle: {
        he: 'טרימסטר נוכחי',
        en: 'Current Trimester',
        es: 'Trimestre Actual',
        fr: 'Trimestre Actuel',
        ar: 'الثلث الحالي',
      },
      progressTitle: {
        he: 'התקדמות ההריון',
        en: 'Pregnancy Progress',
        es: 'Progreso del Embarazo',
        fr: 'Progression de la Grossesse',
        ar: 'نسبة اكتمال الحمل',
      },
      weeks: {
        he: 'שבועות',
        en: 'Weeks',
        es: 'Semanas',
        fr: 'Semaines',
        ar: 'أسابيع',
      },
      week: {
        he: 'שבוע',
        en: 'Week',
        es: 'Semana',
        fr: 'Semaine',
        ar: 'أسبوع',
      },
      days: {
        he: 'ימים',
        en: 'Days',
        es: 'Días',
        fr: 'Jours',
        ar: 'أيام',
      },
      daysLeft: {
        he: 'ימים נותרו',
        en: 'days remaining',
        es: 'días restantes',
        fr: 'jours restants',
        ar: 'يوماً متبقياً',
      },
      daysElapsed: {
        he: 'ימים חלפו מתוך 280',
        en: 'days completed of 280',
        es: 'días transcurridos de 280',
        fr: 'jours écoulés sur 280',
        ar: 'يوماً انقضى من 280',
      },
      trimester1: {
        he: 'שליש ראשון (שבועות 1–13)',
        en: '1st Trimester (Weeks 1–13)',
        es: '1er Trimestre (Semanas 1–13)',
        fr: '1er Trimestre (Semaines 1–13)',
        ar: 'الثلث الأول (الأسابيع 1-13)',
      },
      trimester2: {
        he: 'שליש שני (שבועות 14–27)',
        en: '2nd Trimester (Weeks 14–27)',
        es: '2º Trimestre (Semanas 14–27)',
        fr: '2e Trimestre (Semaines 14–27)',
        ar: 'الثلث الثاني (الأسابيع 14-27)',
      },
      trimester3: {
        he: 'שליש שלישי (שבועות 28–40+)',
        en: '3rd Trimester (Weeks 28–40+)',
        es: '3er Trimestre (Semanas 28–40+)',
        fr: '3e Trimestre (Semaines 28–40+)',
        ar: 'الثلث الثالث (الأسابيع 28-40+)',
      },
      babySizeHeading: {
        he: 'התפתחות העובר והשוואה לפרי / ירק',
        en: 'Fetal Development & Size Comparison',
        es: 'Desarrollo Fetal y Comparación de Tamaño',
        fr: 'Développement Fœtal & Comparaison de Taille',
        ar: 'تطور الجنين ومقارنة الحجم بفواكه وخضروات',
      },
      sizeOf: {
        he: 'השבוע העובר שלך בגודל של:',
        en: 'This week your baby is the size of a:',
        es: 'Esta semana tu bebé tiene el tamaño de:',
        fr: 'Cette semaine votre bébé a la taille d\'un(e) :',
        ar: 'هذا الأسبوع حجم جنينك يعادل:',
      },
      estLength: {
        he: 'אורך משוער:',
        en: 'Est. Length:',
        es: 'Longitud Estimada:',
        fr: 'Taille Estimée :',
        ar: 'الطول التقديري:',
      },
      estWeight: {
        he: 'משקל משוער:',
        en: 'Est. Weight:',
        es: 'Peso Estimado:',
        fr: 'Poids Estimé :',
        ar: 'الوزن التقديري:',
      },
      zodiacHeading: {
        he: 'מזל אסטרולוגי צפוי של התינוק:',
        en: 'Expected Baby Zodiac Sign:',
        es: 'Signo Zodiacal Esperado del Bebé:',
        fr: 'Signe Astrologique Prévu du Bébé :',
        ar: 'البرج الفلكي المتوقع للمولود:',
      },
      fullTermNotice: {
        he: 'הריון במועד מלא (Full Term) – הלידה יכולה להתרחש בכל רגע!',
        en: 'Full Term Reached – Labor can start safely any day now!',
        es: '¡Término Completo Alcanzado! El parto puede comenzar en cualquier momento.',
        fr: 'Terme Atteint ! Le travail peut se déclencher à tout moment.',
        ar: 'حمل مكتمل المدة! يمكن أن تحدث الولادة بأمان في أي لحظة.',
      },
      milestonesHeading: {
        he: 'לוח בדיקות מעקב ואבני דרך רפואיות',
        en: 'Clinical Prenatal Screenings & Milestones Schedule',
        es: 'Calendario de Pruebas Prenatales y Controles Médicos',
        fr: 'Calendrier des Examens Médicaux et Échographies',
        ar: 'جدול الفحوصات الطبية ومواعيد المتابعة الدورية',
      },
      milestonesSubtitle: {
        he: 'תאריכים מותאמים אישית לשבועות ההריון שלך לפי המלצות משרד הבריאות והאיגוד הגינקולוגי',
        en: 'Customized target dates for all essential medical scans according to your pregnancy week',
        es: 'Fechas personalizadas para tus análisis y ecografías según tu semana de embarazo',
        fr: 'Dates cibles personnalisées pour vos consultations et échographies selon votre terme',
        ar: 'تواريخ مخصصة لجميع الفحوصات والسونار حسب أسابيع حملكِ الفعلية',
      },
      statusCompleted: {
        he: 'הושלם',
        en: 'Completed',
        es: 'Completado',
        fr: 'Effectué',
        ar: 'مكتمل',
      },
      statusCurrent: {
        he: 'השבוע / הקרוב ביותר',
        en: 'Current / Upcoming',
        es: 'Actual / Próximo',
        fr: 'En cours / Prochain',
        ar: 'حالي / وشيك',
      },
      statusFuture: {
        he: 'עתידי',
        en: 'Upcoming Later',
        es: 'Próximamente',
        fr: 'À venir',
        ar: 'قادم لاحقاً',
      },
      copySummary: {
        he: 'העתק סיכום הריון',
        en: 'Copy Pregnancy Summary',
        es: 'Copiar Resumen de Embarazo',
        fr: 'Copier le Résumé de Grossesse',
        ar: 'نسخ ملخص بيانات الحمل',
      },
      copiedNotice: {
        he: 'הסיכום הועתק בהצלחה ללוח!',
        en: 'Summary successfully copied to clipboard!',
        es: '¡Resumen copiado al portapapeles!',
        fr: 'Résumé copié dans le presse-papier !',
        ar: 'تم نسخ الملخص إلى الحافظة بنجاح!',
      },
      filterAll: {
        he: 'כל הבדיקות',
        en: 'All Checkups',
        es: 'Todos los Controles',
        fr: 'Tous les Examens',
        ar: 'كافة الفحوصات',
      },
      filterUpcoming: {
        he: 'בדיקות קרובות ועתידיות',
        en: 'Upcoming Screenings',
        es: 'Próximas Pruebas',
        fr: 'Examens à Venir',
        ar: 'الفحوصات القادمة',
      },
      filterCompleted: {
        he: 'בדיקות שכבר עברו',
        en: 'Past Checkups',
        es: 'Pruebas Pasadas',
        fr: 'Examens Passés',
        ar: 'الفحوصات السابقة',
      },
      showMore: {
        he: 'הצג את כל הבדיקות והטיימליין המלא',
        en: 'Show full medical timeline',
        es: 'Ver calendario médico completo',
        fr: 'Afficher le calendrier complet',
        ar: 'عرض الجدول الطبي كاملاً',
      },
      showLess: {
        he: 'הצג פחות',
        en: 'Show less',
        es: 'Mostrar menos',
        fr: 'Afficher moins',
        ar: 'عرض أقل',
      },
      monthNumber: {
        he: 'חודש הריון',
        en: 'Pregnancy Month',
        es: 'Mes de Embarazo',
        fr: 'Mois de Grossesse',
        ar: 'شهر الحمل',
      },
      conceptionDateLabel: {
        he: 'תאריך הפריה משוער:',
        en: 'Est. Conception Date:',
        es: 'Fecha Estimada de Concepción:',
        fr: 'Date Présumée de Fécondation :',
        ar: 'تاريخ الإخصاب التقديري:',
      },
      presetTitle: {
        he: 'בדיקה מהירה לפי שלב:',
        en: 'Quick preset examples:',
        es: 'Ejemplos rápidos:',
        fr: 'Exemples rapides :',
        ar: 'أمثلة سريعة جاهزة:',
      }
    };

    const curLang = lang in dict.title ? lang : 'en';
    const res: Record<string, string> = {};
    for (const key of Object.keys(dict)) {
      res[key] = dict[key][curLang] || dict[key].en || '';
    }
    return res;
  }, [lang]);

  // Format date helper with local string
  const formatFriendlyDate = (isoStr: string) => {
    try {
      const [y, m, d] = isoStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString(lang === 'he' ? 'he-IL' : lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  // Calculate target dates for each prenatal milestone based on the calculated LMP
  const milestonesWithDates = useMemo(() => {
    // Equivalent LMP date is dueDate minus 280 days
    const [dueY, dueM, dueD] = calcResult.dueDate.split('-').map(Number);
    const dueDateObj = new Date(dueY, dueM - 1, dueD);
    const lmpTime = dueDateObj.getTime() - 280 * 24 * 60 * 60 * 1000;

    return PRENATAL_MILESTONES.map((m) => {
      const startDate = new Date(lmpTime + m.startWeek * 7 * 24 * 60 * 60 * 1000);
      const endDate = new Date(lmpTime + (m.endWeek * 7 + 6) * 24 * 60 * 60 * 1000);

      const isCompleted = calcResult.gestationalWeeks > m.endWeek;
      const isCurrent =
        calcResult.gestationalWeeks >= m.startWeek && calcResult.gestationalWeeks <= m.endWeek;
      const isFuture = calcResult.gestationalWeeks < m.startWeek;

      const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
      const loc = lang === 'he' ? 'he-IL' : lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-EG' : 'en-US';
      const dateRangeStr = `${startDate.toLocaleDateString(loc, dateOptions)} – ${endDate.toLocaleDateString(loc, dateOptions)}`;

      return {
        ...m,
        startDate,
        endDate,
        dateRangeStr,
        isCompleted,
        isCurrent,
        isFuture,
        titleText: m.title[lang] || m.title.en,
        descText: m.desc[lang] || m.desc.en,
      };
    });
  }, [calcResult.dueDate, calcResult.gestationalWeeks, lang]);

  const filteredMilestones = useMemo(() => {
    if (timelineFilter === 'completed') {
      return milestonesWithDates.filter((m) => m.isCompleted);
    }
    if (timelineFilter === 'upcoming') {
      return milestonesWithDates.filter((m) => m.isCurrent || m.isFuture);
    }
    return milestonesWithDates;
  }, [milestonesWithDates, timelineFilter]);

  const displayedMilestones = showAllMilestones ? filteredMilestones : filteredMilestones.slice(0, 5);

  // Zodiac localized names & traits
  const zodiacMap: Record<string, { name: Record<string, string>; symbol: string }> = {
    capricorn: { name: { he: 'גדי (Capricorn)', en: 'Capricorn ♑', es: 'Capricornio ♑', fr: 'Capricorne ♑', ar: 'الجدي ♑' }, symbol: '♑' },
    aquarius: { name: { he: 'דלי (Aquarius)', en: 'Aquarius ♒', es: 'Acuario ♒', fr: 'Verseau ♒', ar: 'الدلو ♒' }, symbol: '♒' },
    pisces: { name: { he: 'דגים (Pisces)', en: 'Pisces ♓', es: 'Piscis ♓', fr: 'Poissons ♓', ar: 'الحوت ♓' }, symbol: '♓' },
    aries: { name: { he: 'טלה (Aries)', en: 'Aries ♈', es: 'Aries ♈', fr: 'Bélier ♈', ar: 'الحمل ♈' }, symbol: '♈' },
    taurus: { name: { he: 'שור (Taurus)', en: 'Taurus ♉', es: 'Tauro ♉', fr: 'Taureau ♉', ar: 'الثور ♉' }, symbol: '♉' },
    gemini: { name: { he: 'תאומים (Gemini)', en: 'Gemini ♊', es: 'Géminis ♊', fr: 'Gémeaux ♊', ar: 'الجوزاء ♊' }, symbol: '♊' },
    cancer: { name: { he: 'סרטן (Cancer)', en: 'Cancer ♋', es: 'Cáncer ♋', fr: 'Cancer ♋', ar: 'السرطان ♋' }, symbol: '♋' },
    leo: { name: { he: 'אריה (Leo)', en: 'Leo ♌', es: 'Leo ♌', fr: 'Lion ♌', ar: 'الأسد ♌' }, symbol: '♌' },
    virgo: { name: { he: 'בתולה (Virgo)', en: 'Virgo ♍', es: 'Virgo ♍', fr: 'Vierge ♍', ar: 'العذراء ♍' }, symbol: '♍' },
    libra: { name: { he: 'מאזניים (Libra)', en: 'Libra ♎', es: 'Libra ♎', fr: 'Balance ♎', ar: 'الميزان ♎' }, symbol: '♎' },
    scorpio: { name: { he: 'עקרב (Scorpio)', en: 'Scorpio ♏', es: 'Escorpio ♏', fr: 'Scorpion ♏', ar: 'العقرب ♏' }, symbol: '♏' },
    sagittarius: { name: { he: 'קשת (Sagittarius)', en: 'Sagittarius ♐', es: 'Sagitario ♐', fr: 'Sagittaire ♐', ar: 'القوس ♐' }, symbol: '♐' },
  };

  const babyZodiac = zodiacMap[calcResult.zodiacSign] || zodiacMap.sagittarius;

  const handleCopySummary = () => {
    const summaryText = [
      `👶 ${L.title}`,
      `----------------------------------------`,
      `📅 ${L.dueDateTitle}: ${calcResult.dueDate} (${formatFriendlyDate(calcResult.dueDate)})`,
      `⏳ ${L.gestationalAgeTitle}: ${L.week} ${calcResult.gestationalWeeks} + ${calcResult.gestationalDays} ${L.days}`,
      `🌿 ${L.trimesterTitle}: ${calcResult.trimester === 1 ? L.trimester1 : calcResult.trimester === 2 ? L.trimester2 : L.trimester3}`,
      `📊 ${L.progressTitle}: ${calcResult.progressPercent}% (${calcResult.totalDaysPregnant} / 280 ${L.days})`,
      `🍉 ${L.sizeOf} ${fetalData.fruit[lang as keyof typeof fetalData.fruit] || fetalData.fruit.en} (~${fetalData.lengthCm} cm, ~${fetalData.weightGrams} g)`,
      `⭐ ${L.zodiacHeading} ${babyZodiac.name[lang] || babyZodiac.name.en}`,
      `🌐 https://globalcalcpro.com/${lang}/calculators/pregnancy-calculator`,
    ].join('\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const applyPresetWeeks = (weeksAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - weeksAgo * 7);
    setDateStr(d.toISOString().split('T')[0]);
    setMethod('lmp');
    setCycleLength(28);
  };

  // FAQ Items tailored to this calculator
  const faqItems = useMemo(() => {
    const questions: Record<string, { q: string; a: string }[]> = {
      he: [
        {
          q: 'איך מחשבון שבועות הריון ותאריך לידה עובד?',
          a: 'המחשבון מבוסס על "כלל נייגלה" (Naegele\'s Rule) הרפואי. גיל ההריון המדעי נספר החל מהיום הראשון של הווסת האחרונה (LMP), שהם בדיוק 280 ימים (40 שבועות) עד לתאריך הלידה המשוער. במידה ואורך המחזור שלך אינו 28 ימים סטנדרטיים, המחשבון מתאים את מועד הביוץ והלידה בדיוק מרבי.',
        },
        {
          q: 'מה ההבדל בין שבוע הריון לחודש הריון?',
          a: 'הריון נמשך 40 שבועות, שהם מעט יותר מ-9 חודשים קלנדריים (כ-9 חודשים ושבוע, או 10 חודשים ירחיים של 4 שבועות). חודש 1: שבועות 1-4; חודש 2: שבועות 5-8; חודש 3: שבועות 9-13; חודש 4: שבועות 14-17; חודש 5: שבועות 18-21; חודש 6: שבועות 22-27; חודש 7: שבועות 28-31; חודש 8: שבועות 32-35; חודש 9: שבועות 36-40.',
        },
        {
          q: 'מה הסיכוי שאלד בדיוק בתאריך הלידה המשוער?',
          a: 'סטטיסטית, רק כ-4% עד 5% מהתינוקות נולדים בדיוק ביום התאריך המשוער (EDD). עם זאת, כ-85% עד 90% מהנשים יולדות בטווח הבטוח והתקין של שבועיים לפני או שבועיים אחרי (בין שבוע 37 לשבוע 42), שלב המוגדר כהריון במועד מלא (Full Term).',
        },
        {
          q: 'האם תאריך האולטרסאונד קובע יותר מתאריך הווסת?',
          a: 'בשליש הראשון (שבועות 6 עד 12), בדיקת אולטרסאונד המודדת את אורך העובר (CRL) נחשבת למדויקת ביותר (ברמת סטייה של עד 3-5 ימים בלבד). אם יש פער של יותר מ-5-7 ימים בין תאריך הווסת לאולטרסאונד הראשון, הרופא המטפל יקבע מועד לידה מעודכן לפי האולטרסאונד.',
        },
        {
          q: 'איך מחושב גיל ההריון בטיפולי פוריות והחזרת עוברים (IVF)?',
          a: 'בטיפולי IVF מועד ההפריה ידוע בדיוק מוחלט. בהחזרת עובר מיום 3, תאריך הלידה המשוער הוא 263 ימים מיום ההחזרה. בהחזרת בלסטוציסט (עובר מיום 5), תאריך הלידה המשוער הוא 261 ימים מיום ההחזרה.',
        },
      ],
      en: [
        {
          q: 'How does the pregnancy due date calculator calculate my dates?',
          a: 'The calculator uses the clinical standard Naegele’s Rule. Gestational age is counted from the first day of your last menstrual period (LMP), which corresponds to 280 days (40 weeks) of total pregnancy. If your cycle is shorter or longer than the standard 28 days, ovulation is adjusted automatically.',
        },
        {
          q: 'How do pregnancy weeks convert into pregnancy months?',
          a: 'A 40-week pregnancy spans approximately 9.2 calendar months. Month 1: Weeks 1–4; Month 2: Weeks 5–8; Month 3: Weeks 9–13 (end of 1st trimester); Month 4: Weeks 14–17; Month 5: Weeks 18–21; Month 6: Weeks 22–27 (end of 2nd trimester); Month 7: Weeks 28–31; Month 8: Weeks 32–35; Month 9: Weeks 36–40 (Full Term).',
        },
        {
          q: 'What are the chances of delivering on my exact due date?',
          a: 'Statistically, only about 4% to 5% of babies arrive precisely on their estimated due date (EDD). However, over 85% are born within a normal two-week window before or after (between weeks 37 and 42), which is considered full term.',
        },
        {
          q: 'Does an early ultrasound date override the LMP calculation?',
          a: 'Yes. An early first-trimester ultrasound measuring the crown-rump length (CRL) between 7 and 12 weeks has a margin of error of only 3 to 5 days. If there is a discrepancy greater than 5–7 days from your LMP, doctors typically calibrate your official due date to the ultrasound measurement.',
        },
        {
          q: 'How is gestational age calculated for IVF embryo transfers?',
          a: 'In IVF, conception timing is precise. For a Day 3 embryo transfer, the due date is calculated by adding 263 days to the transfer date. For a Day 5 blastocyst transfer, the due date is 261 days from the transfer date.',
        },
      ],
      es: [
        {
          q: '¿Cómo calcula las fechas esta calculadora de embarazo?',
          a: 'Se basa en la regla médica de Naegele. La edad gestacional se cuenta desde el primer día de tu última regla (FUM), lo que suma 280 días (40 semanas). Si tu ciclo es diferente de 28 días, se compensa la fecha de ovulación.',
        },
        {
          q: '¿Qué porcentaje de mujeres da a luz exactamente en su fecha prevista?',
          a: 'Aproximadamente solo el 4% o 5% de los bebés nacen en su fecha estimada. Más del 85% nacen entre las semanas 37 y 41, periodo considerado a término.',
        },
      ],
      fr: [
        {
          q: 'Comment est calculée la date prévue d\'accouchement (DPA) ?',
          a: 'Le calcul repose sur la règle de Naegele, soit 40 semaines d\'aménorrhée (280 jours) à partir du premier jour des dernières règles.',
        },
        {
          q: 'Quelle est la probabilité d\'accoucher le jour précis du terme ?',
          a: 'Seuls 4 % à 5 % des bébés naissent exactement le jour prévu. La grande majorité naît entre 37 et 41 semaines d\'aménorrhée.',
        },
      ],
      ar: [
        {
          q: 'كيف تحسب حاسبة الحمل موعد الولادة وعمر الجنين؟',
          a: 'تعتمد الحاسبة على قاعدة نيجيلي الطبية، حيث يتم احتساب 280 يوماً (40 أسبوعاً) بدءاً من اليوم الأول لآخر دورة شهرية، مع مراعاة طول الدورة لتحديد موعد التبويض بدقة.',
        },
        {
          q: 'ما هي نسبة الولادة في نفس تاريخ الموعد المتوقع بالضبط؟',
          a: 'حوالي 4% إلى 5% فقط يلدن في اليوم المتوقع بالضبط، بينما تحدث أكثر من 85% من الولادات بين الأسبوع 37 والأسبوع 41.',
        },
      ],
    };

    return questions[lang] || questions.en;
  }, [lang]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: t.catHealth || 'Health', path: `/${lang}/category/health` }, { label: L.title }]} />
      {/* Hero Header */}
      <div className="text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
            <Baby className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              {L.title}
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {L.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all border border-border-subtle shadow-xs active:scale-95"
          title={L.copySummary}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">{L.copiedNotice}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-on-surface-variant" />
              <span>{L.copySummary}</span>
            </>
          )}
        </button>
      </div>

      {/* Prominent Medical Disclaimer */}
      <DisclaimerNotice type="medical" />

      {/* Main Calculation Form Card */}
      <section className="bg-surface rounded-3xl p-6 sm:p-8 shadow-xs border border-border-subtle space-y-6">
        {/* Method Selection Tabs */}
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">
            {lang === 'he' ? 'בחר שיטת חישוב:' : 'Select Calculation Method:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setMethod('lmp')}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 text-center ${
                method === 'lmp'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-border-subtle'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{L.methodLmp}</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('conception')}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 text-center ${
                method === 'conception'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-border-subtle'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{L.methodConception}</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('due_date')}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 text-center ${
                method === 'due_date'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-border-subtle'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{L.methodDueDate}</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('ivf_day5')}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 text-center ${
                method === 'ivf_day5' || method === 'ivf_day3'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-border-subtle'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>IVF / {lang === 'he' ? 'החזרת עוברים' : 'Transfer'}</span>
            </button>
          </div>
        </div>

        {/* IVF Sub-type toggle if IVF selected */}
        {(method === 'ivf_day5' || method === 'ivf_day3') && (
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl border border-border-subtle">
            <span className="text-xs font-bold text-on-surface-variant">
              {lang === 'he' ? 'סוג החזרת עובר:' : 'Transfer Type:'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod('ivf_day5')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  method === 'ivf_day5'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {L.methodIvf5}
              </button>
              <button
                type="button"
                onClick={() => setMethod('ivf_day3')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  method === 'ivf_day3'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {L.methodIvf3}
              </button>
            </div>
          </div>
        )}

        {/* Date Input */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface">
            {method === 'lmp' && L.dateLabelLmp}
            {method === 'conception' && L.dateLabelConception}
            {method === 'due_date' && L.dateLabelDueDate}
            {(method === 'ivf_day3' || method === 'ivf_day5') && L.dateLabelIvf}
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-2xl text-lg font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>
        </div>

        {/* Cycle Length (Only for LMP method) */}
        {method === 'lmp' && (
          <div className="space-y-2 pt-2 border-t border-border-subtle">
            <div className="flex justify-between items-center text-sm font-bold text-on-surface">
              <span>{L.cycleLengthLabel}</span>
              <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-extrabold rounded-xl border border-rose-200 dark:border-rose-900/50">
                {cycleLength} {L.days}
              </span>
            </div>
            <input
              type="range"
              min="21"
              max="40"
              step="1"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full accent-rose-600 dark:accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
              <span>21 {L.days} ({lang === 'he' ? 'קצר' : 'Short'})</span>
              <span>28 {L.days} ({lang === 'he' ? 'ממוצע' : 'Standard'})</span>
              <span>40 {L.days} ({lang === 'he' ? 'ארוך' : 'Long'})</span>
            </div>
            <p className="text-xs text-on-surface-variant/80 mt-1">
              {L.cycleNote}
            </p>
          </div>
        )}

        {/* Quick Presets for Demo / Instant Discovery */}
        <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant">
            {L.presetTitle}
          </span>
          {[
            { label: lang === 'he' ? 'שבוע 8 (שליש 1)' : 'Week 8 (1st Tri)', weeks: 8 },
            { label: lang === 'he' ? 'שבוע 20 (חצי דרך)' : 'Week 20 (Halfway)', weeks: 20 },
            { label: lang === 'he' ? 'שבוע 28 (שליש 3)' : 'Week 28 (3rd Tri)', weeks: 28 },
            { label: lang === 'he' ? 'שבוע 38 (מועד מלא)' : 'Week 38 (Full Term)', weeks: 38 },
          ].map((preset) => (
            <button
              key={preset.weeks}
              type="button"
              onClick={() => applyPresetWeeks(preset.weeks)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant border border-border-subtle transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      {/* Primary Results Hero Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Due Date Card */}
        <div className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent bg-surface rounded-3xl p-5 sm:p-6 border border-rose-200 dark:border-rose-900/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                {L.dueDateTitle}
              </span>
              <CalendarDays className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              {calcResult.dueDate}
            </div>
            <div className="text-xs font-semibold text-rose-800 dark:text-rose-200 mt-1 capitalize">
              {formatFriendlyDate(calcResult.dueDate)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/30 flex items-center justify-between text-xs font-bold text-on-surface-variant">
            <span>{calcResult.daysRemaining} {L.daysLeft}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold">
              40 {L.weeks}
            </span>
          </div>
        </div>

        {/* Exact Gestational Age Card */}
        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-border-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {L.gestationalAgeTitle}
              </span>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              {L.week} {calcResult.gestationalWeeks} <span className="text-lg font-bold text-on-surface-variant">+ {calcResult.gestationalDays} {L.days}</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-1 font-medium">
              {calcResult.totalDaysPregnant} {L.daysElapsed}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-on-surface-variant">
            <span>{L.monthNumber} {calcResult.currentMonth}</span>
            <span>{Math.round(calcResult.totalDaysPregnant / 7)} {L.weeks}</span>
          </div>
        </div>

        {/* Current Trimester Card */}
        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-border-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {L.trimesterTitle}
              </span>
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              {lang === 'he' ? `שליש ${calcResult.trimester}` : `Trimester ${calcResult.trimester}`}
            </div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
              {calcResult.trimester === 1 && L.trimester1}
              {calcResult.trimester === 2 && L.trimester2}
              {calcResult.trimester === 3 && L.trimester3}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle text-xs text-on-surface-variant font-medium">
            {calcResult.isFullTerm ? (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full Term
              </span>
            ) : (
              <span>{L.conceptionDateLabel} {calcResult.conceptionDate}</span>
            )}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-border-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {L.progressTitle}
              </span>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              {calcResult.progressPercent}%
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${calcResult.progressPercent}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>{280 - calcResult.totalDaysPregnant > 0 ? `${280 - calcResult.totalDaysPregnant} ${L.daysLeft}` : 'Due date reached'}</span>
            <span className="font-bold">{calcResult.totalDaysPregnant} / 280</span>
          </div>
        </div>
      </section>

      {/* Trimester Timeline Visual Segment */}
      <section className="bg-surface rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
          {lang === 'he' ? 'ציר זמן טרימסטרים של ההריון' : 'Pregnancy Trimester Visual Progress'}
        </h2>

        <div className="relative pt-2 pb-1">
          {/* Segmented Bar */}
          <div className="grid grid-cols-3 gap-1.5 h-4 w-full rounded-full overflow-hidden bg-surface-container-high p-0.5">
            {/* Tri 1: weeks 1-13 (13/40 = 32.5%) */}
            <div className="relative h-full rounded-l-full overflow-hidden bg-surface-container-highest">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, (calcResult.gestationalWeeks / 13) * 100))}%`,
                }}
              />
            </div>
            {/* Tri 2: weeks 14-27 (14/40 = 35%) */}
            <div className="relative h-full overflow-hidden bg-surface-container-highest">
              <div
                className="h-full bg-sky-500 transition-all duration-300"
                style={{
                  width: `${
                    calcResult.gestationalWeeks < 14
                      ? 0
                      : Math.min(100, Math.max(0, ((calcResult.gestationalWeeks - 13) / 14) * 100))
                  }%`,
                }}
              />
            </div>
            {/* Tri 3: weeks 28-40 (13/40 = 32.5%) */}
            <div className="relative h-full rounded-r-full overflow-hidden bg-surface-container-highest">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{
                  width: `${
                    calcResult.gestationalWeeks < 28
                      ? 0
                      : Math.min(100, Math.max(0, ((calcResult.gestationalWeeks - 27) / 13) * 100))
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Trimester Labels */}
          <div className="grid grid-cols-3 text-center text-xs mt-3 gap-2">
            <div className={`p-2 rounded-xl border ${calcResult.trimester === 1 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-800 dark:text-emerald-300 font-bold' : 'border-border-subtle text-on-surface-variant'}`}>
              <div className="text-[11px] font-bold uppercase">{lang === 'he' ? 'שליש 1' : '1st Trimester'}</div>
              <div className="text-[10px] opacity-80">{lang === 'he' ? 'שבועות 1–13' : 'Weeks 1–13'}</div>
            </div>
            <div className={`p-2 rounded-xl border ${calcResult.trimester === 2 ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 text-sky-800 dark:text-sky-300 font-bold' : 'border-border-subtle text-on-surface-variant'}`}>
              <div className="text-[11px] font-bold uppercase">{lang === 'he' ? 'שליש 2' : '2nd Trimester'}</div>
              <div className="text-[10px] opacity-80">{lang === 'he' ? 'שבועות 14–27' : 'Weeks 14–27'}</div>
            </div>
            <div className={`p-2 rounded-xl border ${calcResult.trimester === 3 ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 text-purple-800 dark:text-purple-300 font-bold' : 'border-border-subtle text-on-surface-variant'}`}>
              <div className="text-[11px] font-bold uppercase">{lang === 'he' ? 'שליש 3' : '3rd Trimester'}</div>
              <div className="text-[10px] opacity-80">{lang === 'he' ? 'שבועות 28–40+' : 'Weeks 28–40+'}</div>
            </div>
          </div>
        </div>

        {calcResult.isFullTerm && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{L.fullTermNotice}</span>
          </div>
        )}
      </section>

      {/* Baby Development & Size Comparison Card */}
      <section className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent bg-surface rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-900/40 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-on-surface">
              {L.babySizeHeading}
            </h2>
          </div>
          <span className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 font-bold rounded-xl border border-amber-300 dark:border-amber-800/60">
            {L.week} {calcResult.gestationalWeeks}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Fruit / Object Comparison Display */}
          <div className="p-6 bg-surface rounded-2xl border border-amber-200/80 dark:border-amber-900/30 text-center flex flex-col items-center justify-center space-y-2 shadow-xs">
            <span className="text-4xl sm:text-5xl" role="img" aria-label="baby size">
              {calcResult.gestationalWeeks <= 6 ? '🌱' :
               calcResult.gestationalWeeks <= 8 ? '🫐' :
               calcResult.gestationalWeeks <= 10 ? '🍓' :
               calcResult.gestationalWeeks <= 12 ? '🍑' :
               calcResult.gestationalWeeks <= 14 ? '🍋' :
               calcResult.gestationalWeeks <= 16 ? '🥑' :
               calcResult.gestationalWeeks <= 18 ? '🫑' :
               calcResult.gestationalWeeks <= 21 ? '🍌' :
               calcResult.gestationalWeeks <= 24 ? '🌽' :
               calcResult.gestationalWeeks <= 27 ? '🥬' :
               calcResult.gestationalWeeks <= 30 ? '🍆' :
               calcResult.gestationalWeeks <= 33 ? '🥔' :
               calcResult.gestationalWeeks <= 36 ? '🍍' :
               calcResult.gestationalWeeks <= 38 ? '🍈' : '🍉'}
            </span>
            <div className="text-xs text-on-surface-variant font-medium">{L.sizeOf}</div>
            <div className="text-xl font-extrabold text-amber-900 dark:text-amber-100">
              {fetalData.fruit[lang as keyof typeof fetalData.fruit] || fetalData.fruit.en}
            </div>
          </div>

          {/* Measurements: Length & Weight */}
          <div className="space-y-4">
            <div className="p-4 bg-surface rounded-2xl border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-on-surface-variant font-semibold">{L.estLength}</div>
                  <div className="text-xl font-bold text-on-surface">~{fetalData.lengthCm} cm</div>
                </div>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">({(fetalData.lengthCm / 2.54).toFixed(1)} in)</span>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-on-surface-variant font-semibold">{L.estWeight}</div>
                  <div className="text-xl font-bold text-on-surface">~{fetalData.weightGrams >= 1000 ? `${(fetalData.weightGrams / 1000).toFixed(2)} kg` : `${fetalData.weightGrams} g`}</div>
                </div>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">({(fetalData.weightGrams / 453.592).toFixed(2)} lbs)</span>
            </div>
          </div>

          {/* Developmental Highlight & Zodiac */}
          <div className="p-5 bg-surface rounded-2xl border border-border-subtle space-y-3">
            <div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                {lang === 'he' ? 'ציון דרך שבועי:' : 'Weekly Milestone:'}
              </span>
              <p className="text-sm text-on-surface mt-1 font-semibold leading-relaxed">
                {fetalData.highlight[lang as keyof typeof fetalData.highlight] || fetalData.highlight.en}
              </p>
            </div>

            <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">{L.zodiacHeading}</span>
              <span className="text-xs font-extrabold text-on-surface bg-surface-container-high px-2.5 py-1 rounded-lg">
                {babyZodiac.name[lang] || babyZodiac.name.en}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Prenatal Medical Screenings & Milestones Timeline */}
      <section className="bg-surface rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                {L.milestonesHeading}
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              {L.milestonesSubtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-surface-container-low rounded-xl border border-border-subtle">
            <button
              onClick={() => setTimelineFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                timelineFilter === 'all'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {L.filterAll}
            </button>
            <button
              onClick={() => setTimelineFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                timelineFilter === 'upcoming'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {L.filterUpcoming}
            </button>
            <button
              onClick={() => setTimelineFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                timelineFilter === 'completed'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {L.filterCompleted}
            </button>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3">
          {displayedMilestones.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border transition-all ${
                m.isCurrent
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 shadow-xs'
                  : m.isCompleted
                  ? 'bg-surface-container-lowest border-border-subtle opacity-85'
                  : 'bg-surface border-border-subtle'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      m.isCompleted
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : m.isCurrent
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {m.isCompleted ? <Check className="w-3.5 h-3.5" /> : m.startWeek}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-on-surface">
                    {m.titleText}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-on-surface-variant px-2.5 py-1 bg-surface-container-low rounded-lg">
                    {m.dateRangeStr}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      m.isCompleted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                        : m.isCurrent
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 font-extrabold'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {m.isCompleted ? L.statusCompleted : m.isCurrent ? L.statusCurrent : L.statusFuture}
                  </span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed ps-8.5">
                {m.descText}
              </p>
            </div>
          ))}
        </div>

        {filteredMilestones.length > 5 && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAllMilestones(!showAllMilestones)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline py-1.5 px-3 rounded-xl hover:bg-surface-container-high transition-colors"
            >
              <span>{showAllMilestones ? L.showLess : L.showMore}</span>
              {showAllMilestones ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </section>

      {/* Clinical Reference Guide & Benchmark Table */}
      <CalculatorGuide guideKey="pregnancy" category="health" />

      {/* Frequently Asked Questions */}
      <FAQ items={faqItems} title={t.faqTitle || (lang === 'he' ? 'שאלות ותשובות נפוצות על שבועות הריון ולידה' : 'Frequently Asked Questions about Pregnancy & Due Dates')} />
    </div>
  );
}
