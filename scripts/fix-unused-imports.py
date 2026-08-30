import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove 'useState' if it is just a warning, but keep the comma structure correct if 'useEffect' etc are there.
    # Case 1: import { useState, useEffect }
    new_content = re.sub(r'import\s*\{\s*useState\s*,\s*', 'import { ', content)
    # Case 2: import { useEffect, useState }
    new_content = re.sub(r',\s*useState\s*\}', ' }', new_content)
    # Case 3: import { useState }
    new_content = re.sub(r'import\s*\{\s*useState\s*\}\s*from\s*[\'"]react[\'"];\n?', '', new_content)
    
    # Also handle unused useUrlState in AgeCalculator
    if 'AgeCalculator.tsx' in filepath:
        new_content = re.sub(r'import\s*\{\s*useUrlState\s*\}\s*from\s*[\'"][^\'"]+[\'"];\n?', '', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed unused imports in {filepath}")

for root, _, files in os.walk('src/pages'):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))
