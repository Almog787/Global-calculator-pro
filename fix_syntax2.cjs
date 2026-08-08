const fs = require('fs');
let code = fs.readFileSync('src/contexts/i18n.tsx', 'utf8');

// I will just replace all instances of unescaped quotes within the fr strings.
// A regex to replace any single quote preceded by a letter and followed by a letter, which isn't already escaped.
code = code.replace(/([a-zA-Z])'([a-zA-Z])/g, "$1\\'$2");

fs.writeFileSync('src/contexts/i18n.tsx', code);
