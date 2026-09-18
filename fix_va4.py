import re

with open('src/components/VirtualAssistant.tsx', 'r') as f:
    c = f.read()

c = re.sub(r'selectedResult\.label\?\\.\[lang\]\s*\|\|\s*selectedResult\.label\?\.en\s*\|\|\s*""', 'selectedResult.label || ""', c)
c = re.sub(r'selectedResult\.desc\?\\.\[lang\]\s*\|\|\s*selectedResult\.desc\?\.en\s*\|\|\s*""', 'selectedResult.desc || ""', c)

# Let's just do a simpler replace since regex with ? is tricky
c = c.replace("selectedResult.label?.[lang] || selectedResult.label?.en || \"\"", "selectedResult.label || \"\"")
c = c.replace("selectedResult.desc?.[lang] || selectedResult.desc?.en || \"\"", "selectedResult.desc || \"\"")

with open('src/components/VirtualAssistant.tsx', 'w') as f:
    f.write(c)
