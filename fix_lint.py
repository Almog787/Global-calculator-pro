import re

with open('src/lib/math/health.ts', 'r') as f:
    content = f.read()

# Make sure bmr is declared safely
content = content.replace("let bmr;", "let bmr = 0;")
content = content.replace("let color;", "let color = 'gray';")
content = content.replace("let status: BmiResult['status'];", "let status: BmiResult['status'] = 'normal';")

with open('src/lib/math/health.ts', 'w') as f:
    f.write(content)
