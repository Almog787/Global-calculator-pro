const fs = require('fs');
let code = fs.readFileSync('src/contexts/i18n.tsx', 'utf8');

const keysStr = `    pwaPromoTitle: string;
    pwaPromoDesc: string;
    pwaPromoBen1: string;
    pwaPromoBen2: string;
    pwaPromoBen3: string;
    pwaPromoStep1: string;
    pwaPromoStep2: string;
`;
code = code.replace('    catLifestyle: string;', '    catLifestyle: string;\n' + keysStr);

const enStr = `    pwaPromoTitle: 'Install Our App',
    pwaPromoDesc: 'You can install our calculators directly to your phone or desktop for quick access anytime.',
    pwaPromoBen1: 'Fast loading & offline access',
    pwaPromoBen2: 'No app store required',
    pwaPromoBen3: 'Takes up minimal storage space',
    pwaPromoStep1: 'Tap the share menu or browser menu (⋮)',
    pwaPromoStep2: 'Select "Add to Home Screen" or "Install App"',
`;
code = code.replace("    catLifestyle: 'Lifestyle & Everyday',", "    catLifestyle: 'Lifestyle & Everyday',\n" + enStr);

const heStr = `    pwaPromoTitle: 'התקן את האפליקציה שלנו',
    pwaPromoDesc: 'ניתן להתקין את המחשבונים שלנו ישירות לטלפון או למחשב לגישה מהירה בכל עת.',
    pwaPromoBen1: 'טעינה מהירה וגישה ללא חיבור לאינטרנט',
    pwaPromoBen2: 'ללא צורך בהורדה מחנות אפליקציות',
    pwaPromoBen3: 'תופס מעט מאוד שטח אחסון',
    pwaPromoStep1: 'לחץ על תפריט הדפדפן (⋮) או על כפתור השיתוף',
    pwaPromoStep2: 'בחר ״הוסף למסך הבית״ או ״התקן אפליקציה״',
`;
code = code.replace("    catLifestyle: 'לייפסטייל ויום-יום',", "    catLifestyle: 'לייפסטייל ויום-יום',\n" + heStr);

const esStr = `    pwaPromoTitle: 'Instala Nuestra App',
    pwaPromoDesc: 'Puedes instalar nuestras calculadoras directamente en tu teléfono o PC para un acceso rápido en cualquier momento.',
    pwaPromoBen1: 'Carga rápida y acceso sin conexión',
    pwaPromoBen2: 'No requiere tienda de aplicaciones',
    pwaPromoBen3: 'Ocupa muy poco espacio de almacenamiento',
    pwaPromoStep1: 'Toca el menú del navegador (⋮) o el botón de compartir',
    pwaPromoStep2: 'Selecciona "Agregar a la pantalla de inicio" o "Instalar aplicación"',
`;
code = code.replace("    catLifestyle: 'Estilo de vida',", "    catLifestyle: 'Estilo de vida',\n" + esStr);

const frStr = `    pwaPromoTitle: 'Installez Notre Application',
    pwaPromoDesc: 'Vous pouvez installer nos calculatrices directement sur votre téléphone ou PC pour un accès rapide à tout moment.',
    pwaPromoBen1: 'Chargement rapide et accès hors ligne',
    pwaPromoBen2: 'Aucune boutique d\\'applications requise',
    pwaPromoBen3: 'Prend très peu d\\'espace de stockage',
    pwaPromoStep1: 'Appuyez sur le menu du navigateur (⋮) ou sur le bouton de partage',
    pwaPromoStep2: 'Sélectionnez "Ajouter à l\\'écran d\\'accueil" ou "Installer l\\'application"',
`;
code = code.replace("    catLifestyle: 'Mode de vie',", "    catLifestyle: 'Mode de vie',\n" + frStr);

const arStr = `    pwaPromoTitle: 'تثبيت تطبيقنا',
    pwaPromoDesc: 'يمكنك تثبيت حاسباتنا مباشرة على هاتفك أو جهاز الكمبيوتر للوصول السريع في أي وقت.',
    pwaPromoBen1: 'تحميل سريع ووصول بدون إنترنت',
    pwaPromoBen2: 'لا يلزم متجر تطبيقات',
    pwaPromoBen3: 'يشغل مساحة تخزين صغيرة جدًا',
    pwaPromoStep1: 'اضغط على قائمة المتصفح (⋮) أو زر المشاركة',
    pwaPromoStep2: 'حدد "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق"',
`;
code = code.replace("    catLifestyle: 'الحياة اليومية',", "    catLifestyle: 'الحياة اليومية',\n" + arStr);

fs.writeFileSync('src/contexts/i18n.tsx', code);
