const fs = require('fs');
const path = require('path');

const dirsToScan = ['src/pages', 'src/pages/calculators'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix title prop: title={t.title} | {globalT.title}  => title={t.title}
  // OR title={t.mortgageTitle} | {t.title} => title={t.mortgageTitle}
  const titleRegex = /title=\{([^}]+)\}\s*\|\s*\{[^}]+\}/g;
  if (titleRegex.test(content)) {
    content = content.replace(titleRegex, 'title={$1}');
    changed = true;
  }
  
  // Also check for name in structuredData: name: t.title} | {globalT.title
  const nameRegex = /name:\s*([^}]+)\}\s*\|\s*\{[^,]+/g;
  if (nameRegex.test(content)) {
    content = content.replace(nameRegex, 'name: $1');
    changed = true;
  }

  // Check for any other corrupted name strings, e.g., name: t.title} | {t.title
  // It's safer to just replace any "name: xxx} | {yyy," with "name: xxx,"
  content = content.replace(/name:\s*([^}]+)\}\s*\|\s*\{[^,]+,/g, 'name: $1,');

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
  }
}

dirsToScan.forEach(dir => {
  const fullDirPath = path.resolve(dir);
  if (fs.existsSync(fullDirPath)) {
    const files = fs.readdirSync(fullDirPath);
    files.forEach(file => {
      if (file.endsWith('.tsx')) {
        processFile(path.join(fullDirPath, file));
      }
    });
  }
});
