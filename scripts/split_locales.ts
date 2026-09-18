import fs from 'fs';
import path from 'path';

// Using a basic string replacement approach since we can't easily execute the TS
// We'll just run Vite-node or tsx to import the existing modules and dump them!

import { translations } from '../src/contexts/i18n';
import { guideTranslations } from '../src/data/guideTranslations';
import { assistantTranslations, assistantTips, quizSteps } from '../src/data/assistantQuiz';

const languages = ['en', 'he', 'es', 'fr', 'ar'];

for (const lang of languages) {
  const localeData = {
    ui: translations[lang] || translations['en'],
    guides: {},
    assistant: assistantTranslations[lang] || assistantTranslations['en'],
    tips: assistantTips.map(tip => ({
      id: tip.id,
      category: tip.category,
      icon: tip.icon,
      title: tip.title[lang] || tip.title['en'],
      content: tip.summary[lang] || tip.summary['en']
    })),
    quiz: Object.keys(quizSteps).reduce((acc, stepId) => {
      const step = quizSteps[stepId];
      acc[stepId] = {
        id: step.id,
        question: step.question[lang] || step.question['en'],
        subtitle: step.subtitle ? (step.subtitle[lang] || step.subtitle['en']) : undefined,
        options: step.options.map(opt => ({
          id: opt.id,
          icon: opt.icon,
          label: opt.label[lang] || opt.label['en'],
          desc: opt.desc ? (opt.desc[lang] || opt.desc['en']) : undefined,
          nextStepId: opt.nextStepId,
          targetPath: opt.targetPath,
          calculatorId: opt.calculatorId
        }))
      };
      return acc;
    }, {})
  };

  // Add guides
  for (const calcId of Object.keys(guideTranslations)) {
    localeData.guides[calcId] = guideTranslations[calcId][lang] || guideTranslations[calcId]['en'];
  }

  const outPath = `src/locales/${lang}.json`;
  if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }
  fs.writeFileSync(outPath, JSON.stringify(localeData, null, 2), 'utf8');
}
console.log('Locales extracted successfully.');
