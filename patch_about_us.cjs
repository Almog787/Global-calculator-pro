const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/AboutUs.tsx');
let content = fs.readFileSync(file, 'utf8');

// en
content = content.replace(
  /We believe precision tools should be freely available without paywalls\./,
  'We believe precision tools, alongside smart AI guidance via our Calc-E Virtual Assistant, should be freely available without paywalls.'
);

// he
content = content.replace(
  /אנו מאמינים שלכל משתמש מגיעה גישה מיידית לחישובים אמינים ללא צורך בהרשמה, תשלום או חשיפת מידע אישי\./,
  'אנו מאמינים שלכל משתמש מגיעה גישה מיידית לחישובים אמינים, בליווי אישי של העוזר החכם Calc-E, ללא צורך בהרשמה, תשלום או חשיפת מידע אישי.'
);

// es
content = content.replace(
  /Creemos que las herramientas de precisión deben ser de libre acceso sin muros de pago\./,
  'Creemos que las herramientas de precisión y la orientación de IA a través de nuestro asistente inteligente Calc-E deben ser de libre acceso sin muros de pago.'
);

// fr
content = content.replace(
  /Nous croyons en un accès libre et sans frais\./,
  'Nous croyons en un accès libre et sans frais à des outils de précision et aux conseils de notre assistant IA Calc-E.'
);

// ar
content = content.replace(
  /نؤمن بأن أدوات الدقة يجب أن تكون متاحة مجانًا بدون رسوم\./,
  'نؤمن بأن أدوات الدقة والتوجيه الذكي عبر مساعدنا Calc-E يجب أن تكون متاحة مجانًا بدون رسوم.'
);

fs.writeFileSync(file, content);
console.log('patched about us');
