const fs = require('fs');
const file = 'src/contexts/i18n.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("avec l'assistant", "avec l\\'assistant");
fs.writeFileSync(file, content);
console.log('fixed');
