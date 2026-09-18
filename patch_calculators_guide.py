import os
import re

for root, _, files in os.walk('src/pages'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            if 'getGuideData' in content:
                # Remove import
                content = re.sub(r"import\s*\{\s*getGuideData\s*\}\s*from\s*['\"].*?guideTranslations['\"];?\n?", "", content)
                
                # Replace hook call. 
                # First find useI18n
                if 'useI18n()' in content:
                    content = re.sub(r"const\s*\{\s*t,\s*lang\s*\}\s*=\s*useI18n\(\);", "const { t, lang, guides } = useI18n();", content)
                    content = re.sub(r"const\s*\{\s*lang,\s*t\s*\}\s*=\s*useI18n\(\);", "const { lang, t, guides } = useI18n();", content)
                    content = re.sub(r"const\s*\{\s*lang\s*\}\s*=\s*useI18n\(\);", "const { lang, guides } = useI18n();", content)
                else:
                    print(f"No useI18n in {filepath}")
                
                # Replace guide extraction
                content = re.sub(
                    r"const\s*guide\s*=\s*getGuideData\(\s*['\"]([^'\"]+)['\"]\s*,\s*lang\s*\);?",
                    r"const guide = guides['\1'] || { guideTitle: 'Guide & Formulas', guideDesc: 'Comprehensive calculation breakdown and FAQs.', faq: [] };",
                    content
                )
                
                with open(filepath, 'w') as f:
                    f.write(content)
