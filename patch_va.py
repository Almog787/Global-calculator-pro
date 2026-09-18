import re

with open('src/components/VirtualAssistant.tsx', 'r') as f:
    content = f.read()

# Replace imports
content = re.sub(r'import\s*\{\s*quizSteps,\s*assistantTranslations,\s*assistantTips,\s*QuizOption,\s*AssistantTip\s*\}\s*from\s*["\']\.\./data/assistantQuiz["\'];', 
                 'import { QuizOption, AssistantTip, QuizStep } from "../types/assistant";', content)

# Update hook call
content = re.sub(r'const\s*\{\s*lang,\s*t\s*\}\s*=\s*useI18n\(\);', 
                 'const { lang, t, assistant: i18nTexts, tips: assistantTips, quiz: quizSteps } = useI18n();', content)

# Remove manual lang lookup
content = re.sub(r'const\s*currentLang\s*=\s*.*?;\n\s*const\s*i18nTexts\s*=\s*.*?;\n', '', content)
content = re.sub(r"const\s*currencySymbol\s*=\s*currentLang.*?;", "const currencySymbol = lang === 'he' ? '₪' : (lang === 'fr' || lang === 'es' ? '€' : '$');", content)

with open('src/components/VirtualAssistant.tsx', 'w') as f:
    f.write(content)
