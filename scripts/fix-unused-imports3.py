import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(r'import\s*\{\s*useState\s*,\s*', 'import { ', content)
    new_content = re.sub(r',\s*useState\s*\}', ' }', new_content)
    new_content = re.sub(r'import\s*\{\s*useState\s*\}\s*from\s*[\'"]react[\'"];\n?', '', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed unused imports in {filepath}")

for root, _, files in os.walk('src/pages/calculators'):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))
