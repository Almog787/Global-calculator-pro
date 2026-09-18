import re

with open('src/contexts/i18n.tsx', 'r') as f:
    content = f.read()

content = content.replace("t: any;", """t: any;
  guides: any;
  assistant: any;
  tips: any;
  quiz: any;""")

content = content.replace("""  const value = {
    lang,
    setLang,
    t: dictionary
  };""", """  const value = {
    lang,
    setLang,
    t: dictionary.ui,
    guides: dictionary.guides,
    assistant: dictionary.assistant,
    tips: dictionary.tips,
    quiz: dictionary.quiz
  };""")

with open('src/contexts/i18n.tsx', 'w') as f:
    f.write(content)
