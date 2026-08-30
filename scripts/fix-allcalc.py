import os

filepath = 'src/pages/AllCalculators.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

bad_str = "import { useState }import { useUrlState } from '../hooks/useUrlState';, useEffect } from \"react\";"
good_str = "import { useState, useEffect } from 'react';\nimport { useUrlState } from '../hooks/useUrlState';"

if bad_str in content:
    content = content.replace(bad_str, good_str)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed AllCalculators.tsx")
else:
    print("Not found")

