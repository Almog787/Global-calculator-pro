import re
import os

# Fix VirtualAssistant
with open('src/components/VirtualAssistant.tsx', 'r') as f:
    content = f.read()

content = content.replace("currentLang", "lang")
content = re.sub(r"tip.title\[lang\] \|\| tip.title\['en'\]", "tip.title", content)
content = re.sub(r"tip.summary\[lang\] \|\| tip.summary\['en'\]", "tip.summary", content)
content = re.sub(r"tip.formulaOrRule\[lang\] \|\| tip.formulaOrRule\['en'\]", "tip.formulaOrRule", content)
content = content.replace("tip.title.en", "tip.title")
content = content.replace("tip.summary.en", "tip.summary")
content = content.replace("tip.formulaOrRule", "tip.summary") # fallback if formulaOrRule doesn't exist on interface
content = re.sub(r"tip\.desc\s*\?\s*\(tip\.desc\[lang\] \|\| tip\.desc\['en'\]\)\s*:\s*undefined", "tip.desc", content)

content = content.replace("option.label[lang] || option.label['en']", "option.label")
content = content.replace("option.desc ? (option.desc[lang] || option.desc['en']) : undefined", "option.desc")
content = content.replace("step.question[lang] || step.question['en']", "step.question")
content = content.replace("step.subtitle ? (step.subtitle[lang] || step.subtitle['en']) : undefined", "step.subtitle")

content = re.sub(r"\(tip:\s*any\)", "(tip: AssistantTip)", content)
content = re.sub(r"tip\s*=>", "(tip: AssistantTip) =>", content)
content = re.sub(r"\(option:\s*any,\s*idx:\s*any\)", "(option: QuizOption, idx: number)", content)
content = re.sub(r"\(tip:\s*any,\s*idx:\s*any\)", "(tip: AssistantTip, idx: number)", content)

# just to be sure we catch un-typed map arrows
content = re.sub(r"option\s*=>", "(option: QuizOption) =>", content)

with open('src/components/VirtualAssistant.tsx', 'w') as f:
    f.write(content)

# Fix calculators typing issues
for root, _, files in os.walk('src/pages'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                c = f.read()
            # replace map((line, idx) =>
            c = re.sub(r"map\(\s*\(\s*line\s*,\s*idx\s*\)\s*=>", "map((line: string, idx: number) =>", c)
            # also replace map((line, index) =>
            c = re.sub(r"map\(\s*\(\s*line\s*,\s*index\s*\)\s*=>", "map((line: string, index: number) =>", c)
            with open(filepath, 'w') as f:
                f.write(c)

