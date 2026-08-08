const fs = require('fs');

const content = fs.readFileSync('src/contexts/i18n.tsx', 'utf8');

const newKeysType = `
    // Suggestions
    suggestionsTitle: string;
    suggestionsDesc: string;
    suggestionsExplanation: string;
    suggestionType: string;
    suggestionTypeCalc: string;
    suggestionTypeFeature: string;
    suggestionTypeBug: string;
    suggestionTitleField: string;
    suggestionDetailsField: string;
    submitGithubIssue: string;
    suggestionSuccess: string;
`;

const enAdd = `
    // Suggestions
    suggestionsTitle: 'Suggest a Feature',
    suggestionsDesc: 'Submit feature ideas and calculator requests for GlobalCalc Pro.',
    suggestionsExplanation: 'Have an idea for a new calculator or feature? Submit your suggestion directly to our GitHub project backlog!',
    suggestionType: 'Category',
    suggestionTypeCalc: 'New Calculator Request',
    suggestionTypeFeature: 'Feature / Improvement',
    suggestionTypeBug: 'Bug / Issue Report',
    suggestionTitleField: 'Suggestion Title',
    suggestionDetailsField: 'Detailed Description',
    submitGithubIssue: 'Open GitHub Issue & Submit',
    suggestionSuccess: 'Thank you! Your suggestion is ready on GitHub.',
`;

const heAdd = `
    // Suggestions
    suggestionsTitle: 'הצעת ייעול / כלי חדש',
    suggestionsDesc: 'שלח הצעות לכלים חדשים ושיפורים עבור GlobalCalc Pro.',
    suggestionsExplanation: 'יש לך רעיון למחשבון חדש או פיצ׳ר מועיל? שלח את ההצעה שלך ישירות כ-Issue בפרויקט ה-GitHub שלנו!',
    suggestionType: 'קטגוריה',
    suggestionTypeCalc: 'בקשה למחשבון חדש',
    suggestionTypeFeature: 'הצעת ייעול / שיפור',
    suggestionTypeBug: 'דיווח על תקלה',
    suggestionTitleField: 'כותרת ההצעה',
    suggestionDetailsField: 'פירוט והסבר',
    submitGithubIssue: 'פתח Issue ב-GitHub ושלח',
    suggestionSuccess: 'תודה רבה! ההצעה שלך מוכנה ב-GitHub.',
`;

const esAdd = `
    // Suggestions
    suggestionsTitle: 'Sugerir función',
    suggestionsDesc: 'Envíe ideas y sugerencias de nuevas calculadoras para GlobalCalc Pro.',
    suggestionsExplanation: '¿Tiene una idea para una nueva calculadora o función? ¡Envíe su sugerencia directamente como una Issue en GitHub!',
    suggestionType: 'Categoría',
    suggestionTypeCalc: 'Solicitud de nueva calculadora',
    suggestionTypeFeature: 'Mejora / Función',
    suggestionTypeBug: 'Reporte de error',
    suggestionTitleField: 'Título de la sugerencia',
    suggestionDetailsField: 'Descripción detallada',
    submitGithubIssue: 'Abrir Issue en GitHub',
    suggestionSuccess: '¡Gracias! Su sugerencia está lista en GitHub.',
`;

const frAdd = `
    // Suggestions
    suggestionsTitle: 'Suggérer une fonctionnalité',
    suggestionsDesc: 'Proposez des idées et de nouvelles calculatrices pour GlobalCalc Pro.',
    suggestionsExplanation: 'Vous avez une idée de nouvelle calculatrice ou fonctionnalité ? Soumettez votre suggestion directement sur GitHub !',
    suggestionType: 'Catégorie',
    suggestionTypeCalc: 'Demande de nouvelle calculatrice',
    suggestionTypeFeature: 'Amélioration / Fonctionnalité',
    suggestionTypeBug: 'Rapport de bug',
    suggestionTitleField: 'Titre de la suggestion',
    suggestionDetailsField: 'Description détaillée',
    submitGithubIssue: 'Ouvrir une Issue sur GitHub',
    suggestionSuccess: 'Merci ! Votre suggestion est prête sur GitHub.',
`;

const arAdd = `
    // Suggestions
    suggestionsTitle: 'اقتراح ميزة جديدة',
    suggestionsDesc: 'قدّم أفكاراً واقتراحات لحاسبات جديدة في GlobalCalc Pro.',
    suggestionsExplanation: 'هل لديك فكرة لحاسبة جديدة أو ميزة مفيدة؟ أرسل اقتراحك مباشرة كـ Issue في مشروع GitHub!',
    suggestionType: 'الفئة',
    suggestionTypeCalc: 'طلب حاسبة جديدة',
    suggestionTypeFeature: 'تحسين / ميزة',
    suggestionTypeBug: 'الإبلاغ عن خطأ',
    suggestionTitleField: 'عنوان الاقتراح',
    suggestionDetailsField: 'الوصف التفصيلي',
    submitGithubIssue: 'فتح Issue في GitHub وإرسال',
    suggestionSuccess: 'شكراً لك! اقتراحك جاهز في GitHub.',
`;

let updated = content;

// 1. Add key declarations to Translations type
updated = updated.replace(
  /    footerDisclaimer: string;\n  \};\n\};/m,
  `    footerDisclaimer: string;${newKeysType}  };\n};`
);

// 2. Add en translations
updated = updated.replace(
  /    footerDisclaimer: 'Calculations provided on this site are for informational purposes only.'\n  \},/m,
  `    footerDisclaimer: 'Calculations provided on this site are for informational purposes only.',${enAdd}  },`
);

// 3. Add he translations
updated = updated.replace(
  /    footerDisclaimer: 'החישובים המסופקים באתר זה נועדו למטרות מידע בלבד.'\n  \},/m,
  `    footerDisclaimer: 'החישובים המסופקים באתר זה נועדו למטרות מידע בלבד.',${heAdd}  },`
);

// 4. Add es translations
updated = updated.replace(
  /    footerDisclaimer: 'Los cálculos proporcionados son solo para fines informativos.'\n  \},/m,
  `    footerDisclaimer: 'Los cálculos proporcionados son solo para fines informativos.',${esAdd}  },`
);

// 5. Add fr translations
updated = updated.replace(
  /    footerDisclaimer: 'Les calculs fournis sur ce site sont à titre indicatif uniquement.'\n  \},/m,
  `    footerDisclaimer: 'Les calculs fournis sur ce site sont à titre indicatif uniquement.',${frAdd}  },`
);

// 6. Add ar translations
updated = updated.replace(
  /    footerDisclaimer: 'الحسابات المقدمة في هذا الموقع هي لأغراض الإعلام فقط.'\n  \}\n\};/m,
  `    footerDisclaimer: 'الحسابات المقدمة في هذا الموقع هي لأغراض الإعلام فقط.',${arAdd}  }\n};`
);

fs.writeFileSync('src/contexts/i18n.tsx', updated);
console.log('Successfully patched i18n file with suggestion keys!');
