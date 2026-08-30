import os

for root, _, files in os.walk('src/pages/calculators'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if "from '../hooks/useUrlState'" in content:
                content = content.replace("from '../hooks/useUrlState'", "from '../../hooks/useUrlState'")
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed paths in {filepath}")
