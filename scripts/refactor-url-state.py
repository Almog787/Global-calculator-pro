import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'useUrlState' in content:
        return # already processed
        
    # We want to replace useState with useUrlState ONLY for strings/numbers/booleans, but not object arrays.
    # Usually in these calculators it's `useState<number | ''>(20)` or `useState<number>(10)`.
    # Let's find them.
    
    # Import useUrlState
    if 'import { useState' in content:
        content = content.replace("import { useState", "import { useState }\nimport { useUrlState } from '../hooks/useUrlState';\n// import { useState")
    
    # regex to find useState
    # const [val1A, setVal1A] = useState<number | ''>(20);
    # matches: const [(\w+),\s*(\w+)]\s*=\s*useState(?:<[^>]+>)?\(([^)]+)\);
    
    pattern = re.compile(r'const\s+\[(\w+),\s*(\w+)\]\s*=\s*useState(?:<([^>]+)>)?\(([^)]+)\);')
    
    def repl(m):
        var_name = m.group(1)
        setter_name = m.group(2)
        type_hint = m.group(3)
        default_val = m.group(4)
        
        # Don't convert objects or arrays
        if default_val.startswith('{') or default_val.startswith('['):
            return m.group(0)
            
        # Add a unique key based on the variable name
        return f"const [{var_name}, {setter_name}] = useUrlState{f'<{type_hint}>' if type_hint else ''}('{var_name}', {default_val});"
    
    new_content = pattern.sub(repl, content)
    
    # Fix imports: remove the commented import if not used
    new_content = new_content.replace("// import { useState", "")
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Refactored {filepath}")

for root, _, files in os.walk('src/pages'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
