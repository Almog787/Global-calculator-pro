const fs = require('fs');

const content = fs.readFileSync('src/contexts/i18n.tsx', 'utf8');

const newKeysType = `
    // Contact & Legal & About
    contactTitle: string;
    contactDesc: string;
    contactExplanation: string;
    fullName: string;
    emailAddress: string;
    subject: string;
    message: string;
    sendMessage: string;
    messageSentSuccess: string;
    contactInfoNote: string;

    privacyTitle: string;
    privacyDesc: string;
    termsTitle: string;
    termsDesc: string;
    aboutTitle: string;
    aboutDesc: string;

    footerCalculators: string;
    footerLegal: string;
    footerRights: string;
    footerDisclaimer: string;
`;

const enAdd = `
    // Contact & Legal & About
    contactTitle: 'Contact Us',
    contactDesc: 'Get in touch with the GlobalCalc Pro team.',
    contactExplanation: 'Have a question, feedback, or suggestion? Send us a message using the form below.',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    subject: 'Subject',
    message: 'Message',
    sendMessage: 'Send Message',
    messageSentSuccess: 'Thank you! Your message has been sent successfully.',
    contactInfoNote: 'Contact details will be updated soon. You can use the form above for any inquiries.',

    privacyTitle: 'Privacy Policy',
    privacyDesc: 'Learn how GlobalCalc Pro protects your privacy and data.',
    termsTitle: 'Terms of Service',
    termsDesc: 'Read our terms and conditions for using GlobalCalc Pro.',
    aboutTitle: 'About Us',
    aboutDesc: 'Discover GlobalCalc Pro - free, fast, and accessible online calculation tools.',

    footerCalculators: 'Calculators',
    footerLegal: 'Legal & Info',
    footerRights: 'All rights reserved.',
    footerDisclaimer: 'Calculations provided on this site are for informational purposes only.',
`;

const heAdd = `
    // Contact & Legal & About
    contactTitle: 'צור קשר',
    contactDesc: 'צור קשר עם צוות GlobalCalc Pro.',
    contactExplanation: 'יש לך שאלה, משוב או הצעה? שלח לנו הודעה באמצעות הטופס למטה.',
    fullName: 'שם מלא',
    emailAddress: 'כתובת אימייל',
    subject: 'נושא',
    message: 'הודעה',
    sendMessage: 'שלח הודעה',
    messageSentSuccess: 'תודה! ההודעה שלך נשלחה בהצלחה.',
    contactInfoNote: 'פרטי התקשרות יעודכנו בקרוב. ניתן להשתמש בטופס שלמעלה לכל פנייה.',

    privacyTitle: 'מדיניות פרטיות',
    privacyDesc: 'למד כיצד GlobalCalc Pro מגינה על הפרטיות והנתונים שלך.',
    termsTitle: 'תנאי שימוש',
    termsDesc: 'קרא את תנאי השימוש עבור GlobalCalc Pro.',
    aboutTitle: 'אודותינו',
    aboutDesc: 'גלה את GlobalCalc Pro - כלי חישוב מקוונים חינמיים, מהירים ונגישים.',

    footerCalculators: 'מחשבונים',
    footerLegal: 'מידע ומשפטי',
    footerRights: 'כל הזכויות שמורות.',
    footerDisclaimer: 'החישובים המסופקים באתר זה נועדו למטרות מידע בלבד.',
`;

const esAdd = `
    // Contact & Legal & About
    contactTitle: 'Contacto',
    contactDesc: 'Póngase en contacto con el equipo de GlobalCalc Pro.',
    contactExplanation: '¿Tiene preguntas, comentarios o sugerencias? Envíenos un mensaje con el formulario.',
    fullName: 'Nombre Completo',
    emailAddress: 'Correo Electrónico',
    subject: 'Asunto',
    message: 'Mensaje',
    sendMessage: 'Enviar Mensaje',
    messageSentSuccess: '¡Gracias! Su mensaje ha sido enviado con éxito.',
    contactInfoNote: 'Los detalles de contacto se actualizarán pronto. Puede utilizar el formulario anterior para cualquier consulta.',

    privacyTitle: 'Política de Privacidad',
    privacyDesc: 'Aprenda cómo GlobalCalc Pro protege su privacidad y sus datos.',
    termsTitle: 'Términos de Servicio',
    termsDesc: 'Lea nuestros términos y condiciones de uso para GlobalCalc Pro.',
    aboutTitle: 'Sobre Nosotros',
    aboutDesc: 'Descubra GlobalCalc Pro: herramientas de cálculo en línea gratuitas, rápidas y accesibles.',

    footerCalculators: 'Calculadoras',
    footerLegal: 'Información y Legal',
    footerRights: 'Todos los derechos reservados.',
    footerDisclaimer: 'Los cálculos proporcionados son solo para fines informativos.',
`;

const frAdd = `
    // Contact & Legal & About
    contactTitle: 'Contactez-nous',
    contactDesc: 'Prenez contact avec l\\'équipe de GlobalCalc Pro.',
    contactExplanation: 'Vous avez une question, une remarque ou une suggestion ? Envoyez-nous un message ci-dessous.',
    fullName: 'Nom Complet',
    emailAddress: 'Adresse E-mail',
    subject: 'Sujet',
    message: 'Message',
    sendMessage: 'Envoyer le Message',
    messageSentSuccess: 'Merci ! Votre message a été envoyé avec succès.',
    contactInfoNote: 'Les coordonnées seront bientôt mises à jour. Vous pouvez utiliser le formulaire ci-dessus pour toute demande.',

    privacyTitle: 'Politique de Confidentialité',
    privacyDesc: 'Découvrez comment GlobalCalc Pro protège votre vie privée et vos données.',
    termsTitle: 'Conditions d\\'Utilisation',
    termsDesc: 'Lisez nos conditions d\\'utilisation pour GlobalCalc Pro.',
    aboutTitle: 'À Propos',
    aboutDesc: 'Découvrez GlobalCalc Pro - des outils de calcul en ligne gratuits, rapides et accessibles.',

    footerCalculators: 'Calculatrices',
    footerLegal: 'Informations Légales',
    footerRights: 'Tous droits réservés.',
    footerDisclaimer: 'Les calculs fournis sur ce site sont à titre indicatif uniquement.',
`;

const arAdd = `
    // Contact & Legal & About
    contactTitle: 'اتصل بنا',
    contactDesc: 'تواصل مع فريق GlobalCalc Pro.',
    contactExplanation: 'هل لديك سؤال أو ملاحظة أو اقتراح؟ أرسل لنا رسالة باستخدام النموذج أدناه.',
    fullName: 'الاسم الكامل',
    emailAddress: 'البريد الإلكتروني',
    subject: 'الموضوع',
    message: 'الرسالة',
    sendMessage: 'إرسال الرسالة',
    messageSentSuccess: 'شكراً لك! تم إرسال رسالتك بنجاح.',
    contactInfoNote: 'سيتم تحديث تفاصيل الاتصال قريبًا. يمكنك استخدام النموذج أعلاه لأي استفسار.',

    privacyTitle: 'سياسة الخصوصية',
    privacyDesc: 'تعرف على كيفية حماية GlobalCalc Pro لخصوصيتك وبياناتك.',
    termsTitle: 'شروط الخدمة',
    termsDesc: 'اقرأ شروط وأحكام استخدام GlobalCalc Pro.',
    aboutTitle: 'من نحن',
    aboutDesc: 'اكتشف GlobalCalc Pro - أدوات حساب مجانية وسريعة عبر الإنترنت.',

    footerCalculators: 'الحاسبات',
    footerLegal: 'المعلومات والقانونية',
    footerRights: 'جميع الحقوق محفوظة.',
    footerDisclaimer: 'الحسابات المقدمة في هذا الموقع هي لأغراض الإعلام فقط.',
`;

let updated = content;

// 1. Add key declarations to Translations type
updated = updated.replace(
  /    daysOld: string;\n  \};\n\};/m,
  `    daysOld: string;${newKeysType}  };\n};`
);

// 2. Add en translations
updated = updated.replace(
  /    daysOld: 'Days'\n  \},/m,
  `    daysOld: 'Days',${enAdd}  },`
);

// 3. Add he translations
updated = updated.replace(
  /    daysOld: 'ימים'\n  \},/m,
  `    daysOld: 'ימים',${heAdd}  },`
);

// 4. Add es translations
updated = updated.replace(
  /    daysOld: 'Días'\n  \},/m,
  `    daysOld: 'Días',${esAdd}  },`
);

// 5. Add fr translations
updated = updated.replace(
  /    daysOld: 'Jours'\n  \},/m,
  `    daysOld: 'Jours',${frAdd}  },`
);

// 6. Add ar translations
updated = updated.replace(
  /    daysOld: 'أيام'\n  \}\n\};/m,
  `    daysOld: 'أيام',${arAdd}  }\n};`
);

fs.writeFileSync('src/contexts/i18n.tsx', updated);
console.log('Successfully patched i18n file!');
