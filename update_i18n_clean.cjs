const fs = require('fs');

let content = fs.readFileSync('src/contexts/i18n.tsx', 'utf8');

// Replace translations in English
content = content.replace(
  /suggestionsExplanation: 'Have an idea for a new calculator or feature\? Submit your suggestion directly to our GitHub project backlog!',/g,
  "suggestionsExplanation: 'Have an idea for a new calculator or feature? Share your suggestion with us to help improve GlobalCalc Pro.',"
);
content = content.replace(
  /submitGithubIssue: 'Open GitHub Issue & Submit',/g,
  "submitGithubIssue: 'Submit Suggestion',"
);
content = content.replace(
  /suggestionSuccess: 'Thank you! Your suggestion is ready on GitHub\.',/g,
  "suggestionSuccess: 'Thank you! Your suggestion has been received successfully.',"
);

// Replace translations in Hebrew
content = content.replace(
  /suggestionsExplanation: 'יש לך רעיון למחשבון חדש או פיצ׳ר מועיל\? שלח את ההצעה שלך ישירות כ-Issue בפרויקט ה-GitHub שלנו!',/g,
  "suggestionsExplanation: 'יש לך רעיון למחשבון חדש או הצעה לשיפור? שתף אותנו בהצעה שלך כדי לעזור לנו לשפר את GlobalCalc Pro.',"
);
content = content.replace(
  /submitGithubIssue: 'פתח Issue ב-GitHub ושלח',/g,
  "submitGithubIssue: 'שלח הצעה',"
);
content = content.replace(
  /suggestionSuccess: 'תודה רבה! ההצעה שלך מוכנה ב-GitHub\.',/g,
  "suggestionSuccess: 'תודה רבה! ההצעה שלך התקבלה בהצלחה ותועבר לבחינת הצוות.',"
);

// Replace translations in Spanish
content = content.replace(
  /suggestionsExplanation: '¿Tiene una idea para una nueva calculadora o función\? ¡Envíe su sugerencia directamente como una Issue en GitHub!',/g,
  "suggestionsExplanation: '¿Tiene una idea para una nueva calculadora o función? Comparta su sugerencia para ayudarnos a mejorar GlobalCalc Pro.',"
);
content = content.replace(
  /submitGithubIssue: 'Abrir Issue en GitHub',/g,
  "submitGithubIssue: 'Enviar Sugerencia',"
);
content = content.replace(
  /suggestionSuccess: '¡Gracias! Su sugerencia está lista en GitHub\.',/g,
  "suggestionSuccess: '¡Gracias! Su sugerencia ha sido recibida con éxito.',"
);

// Replace translations in French
content = content.replace(
  /suggestionsExplanation: "Vous avez une idée de nouvelle calculatrice ou fonctionnalité \? Soumettez votre suggestion directement sur GitHub !",/g,
  "suggestionsExplanation: 'Vous avez une idée de nouvelle calculatrice ou d\\'amélioration ? Partagez votre suggestion pour nous aider à améliorer GlobalCalc Pro.',"
);
content = content.replace(
  /submitGithubIssue: 'Ouvrir une Issue sur GitHub',/g,
  "submitGithubIssue: 'Envoyer la suggestion',"
);
content = content.replace(
  /suggestionSuccess: 'Merci ! Votre suggestion est prête sur GitHub\.',/g,
  "suggestionSuccess: 'Merci ! Votre suggestion a été reçue avec succès.',"
);

// Replace translations in Arabic
content = content.replace(
  /suggestionsExplanation: 'هل لديك فكرة لحاسبة جديدة أو ميزة مفيدة\؟ أرسل اقتراحك مباشرة كـ Issue في مشروع GitHub!',/g,
  "suggestionsExplanation: 'هل لديك فكرة لحاسبة جديدة أو اقتراح للتحسين؟ شاركنا باقتراحك لمساعدتنا في تحسين GlobalCalc Pro.',"
);
content = content.replace(
  /submitGithubIssue: 'فتح Issue في GitHub وإرسال',/g,
  "submitGithubIssue: 'إرسال الاقتراح',"
);
content = content.replace(
  /suggestionSuccess: 'شكراً لك! اقتراحك جاهز في GitHub\.',/g,
  "suggestionSuccess: 'شكراً جزيلاً! تم استلام اقتراحك بنجاح وسيتم מراجعته قريباً.',"
);

fs.writeFileSync('src/contexts/i18n.tsx', content);
console.log('Cleaned i18n texts successfully!');
