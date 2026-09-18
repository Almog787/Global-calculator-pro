import re

with open('src/components/VirtualAssistant.tsx', 'r') as f:
    c = f.read()

# Fix tip property access
c = re.sub(r'tip\.title\[lang\] \|\| tip\.title', 'tip.title', c)
c = re.sub(r'tip\.summary\[lang\] \|\| tip\.summary', 'tip.summary', c)
c = re.sub(r'tip\.title\?\.\[lang\]\s*\|\|\s*tip\.title\?\.en\s*\|\|\s*""', 'tip.title || ""', c)
c = re.sub(r'tip\.summary\?\.\[lang\]\s*\|\|\s*tip\.summary\?\.en\s*\|\|\s*""', 'tip.summary || ""', c)

# Fix option property access
c = re.sub(r'option\.label\?\.\[lang\]\s*\|\|\s*option\.label\?\.en\s*\|\|\s*""', 'option.label || ""', c)
c = re.sub(r'option\.desc\?\.\[lang\]\s*\|\|\s*option\.desc\?\.en\s*\|\|\s*""', 'option.desc || ""', c)

# Fix step property access
c = re.sub(r'currentStep\?\.question\?\.\[lang\]\s*\|\|\s*currentStep\?\.question\?\.en\s*\|\|\s*""', 'currentStep?.question || ""', c)

# Fix map signatures that still missed typings
c = re.sub(r'currentStep\?\.options\?\.map\(\(option,\s*idx\)', 'currentStep?.options?.map((option: QuizOption, idx: number)', c)

with open('src/components/VirtualAssistant.tsx', 'w') as f:
    f.write(c)

