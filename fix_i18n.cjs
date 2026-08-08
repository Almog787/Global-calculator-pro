const fs = require('fs');

let content = fs.readFileSync('src/contexts/i18n.tsx', 'utf8');

// en
content = content.replace(/allTools: 'All Tools',/g, "allTools: 'All Tools',\n    faqTitle: 'Frequently Asked Questions',");
// he
content = content.replace(/allTools: 'כל הכלים',/g, "allTools: 'כל הכלים',\n    faqTitle: 'שאלות ותשובות',");
// es
content = content.replace(/allTools: 'Todas las Herramientas',/g, "allTools: 'Todas las Herramientas',\n    faqTitle: 'Preguntas Frecuentes',");
// fr
content = content.replace(/allTools: 'Tous les Outils',/g, "allTools: 'Tous les Outils',\n    faqTitle: 'Foire Aux Questions',");
// ar
content = content.replace(/allTools: 'كل الأدوات',/g, "allTools: 'كل الأدوات',\n    faqTitle: 'أسئلة مكررة',");

fs.writeFileSync('src/contexts/i18n.tsx', content);
console.log('Fixed i18n FAQ titles');
