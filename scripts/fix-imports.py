import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace:
    # "import { useState }\nimport { useUrlState } from '../hooks/useUrlState';\n, useEffect } from 'react';"
    # OR similar
    
    import re
    # Match: import { useState } \n import { useUrlState } from '...'; \n [rest of react imports] } from 'react';
    pattern = re.compile(r"import \{\s*useState\s*\}\nimport \{\s*useUrlState\s*\} from '([^']+)';\n(.*?)from 'react';", re.DOTALL)
    
    def repl(m):
        path = m.group(1)
        rest = m.group(2)
        # rest might be ", useEffect } "
        return f"import {{ useState{rest}from 'react';\nimport {{ useUrlState }} from '{path}';"
    
    new_content = pattern.sub(repl, content)
    
    # What if it was just "import { useState }\nimport { useUrlState } from '...';\n"
    # and no other imports from react?
    # then it was "import { useState } from 'react';" initially
    pattern2 = re.compile(r"import \{\s*useState\s*\}\nimport \{\s*useUrlState\s*\} from '([^']+)';\nfrom 'react';", re.DOTALL)
    def repl2(m):
        path = m.group(1)
        return f"import {{ useState }} from 'react';\nimport {{ useUrlState }} from '{path}';"
        
    new_content = pattern2.sub(repl2, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src/pages'):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))
