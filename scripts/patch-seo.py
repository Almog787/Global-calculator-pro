import os
import re

filepath = 'src/pages/PercentageFinder.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace:
#  const { t, lang } = useI18n();
#  const guide = getGuideData('percentage', lang);
#  const isHebrew = lang === 'he';
# ...
#  <SEO
#    title={guide.title}
#    description={guide.description}
#  />

# We want to insert dynamic title logic before the return statement.
# But since this file is big, I'll just use sed or Python to replace the <SEO> tags.

import re

seo_code = """
  let dynamicTitle = guide.title;
  let dynamicDesc = guide.description;

  if (activeTab === 'of' && val1A !== '' && val1B !== '') {
    dynamicTitle = isHebrew ? `כמה זה ${val1A}% מתוך ${val1B}? | מחשבון אחוזים` : `What is ${val1A}% of ${val1B}? | Percentage Calculator`;
    dynamicDesc = isHebrew ? `חישוב מהיר: ${val1A}% מתוך ${val1B} שווה ל-${res1}. השתמשו במחשבון האחוזים שלנו לחישובים נוספים.` : `Quick calculation: ${val1A}% of ${val1B} is ${res1}. Use our percentage calculator for more.`;
  } else if (activeTab === 'isWhat' && val2A !== '' && val2B !== '') {
    dynamicTitle = isHebrew ? `${val2A} זה איזה אחוז מתוך ${val2B}? | מחשבון אחוזים` : `${val2A} is what percent of ${val2B}? | Percentage Calculator`;
    dynamicDesc = isHebrew ? `התשובה: ${val2A} מתוך ${val2B} הם ${res2.toFixed(2)}%.` : `The answer: ${val2A} out of ${val2B} is ${res2.toFixed(2)}%.`;
  } else if (activeTab === 'change' && val3A !== '' && val3B !== '') {
    dynamicTitle = isHebrew ? `שינוי באחוזים מ-${val3A} ל-${val3B} | מחשבון אחוזים` : `Percentage change from ${val3A} to ${val3B} | Percentage Calculator`;
  } else if (activeTab === 'discount' && val4Price !== '' && val4Discount !== '') {
    dynamicTitle = isHebrew ? `הנחה של ${val4Discount}% על ${val4Price} | מחשבון אחוזים` : `${val4Discount}% discount on ${val4Price} | Percentage Calculator`;
  }

  return (
    <div className="w-full">
      <SEO
        title={dynamicTitle}
        description={dynamicDesc}
      />
"""

content = content.replace("  return (\n    <div className=\"w-full\">\n      <SEO\n        title={guide.title}\n        description={guide.description}\n      />", seo_code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched PercentageFinder.tsx")
