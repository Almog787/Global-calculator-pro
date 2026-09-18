import re

with open('src/components/VirtualAssistant.tsx', 'r') as f:
    c = f.read()

# Fix types in .map
c = re.sub(r'assistantTips\.filter\(tip =>', 'assistantTips.filter((tip: AssistantTip) =>', c)
c = re.sub(r'assistantTips\.filter\(\(tip\) =>', 'assistantTips.filter((tip: AssistantTip) =>', c)
c = re.sub(r'assistantTips\.map\(\(tip,\s*idx\)', 'assistantTips.map((tip: AssistantTip, idx: number)', c)
c = re.sub(r'options\.map\(\(option,\s*idx\)', 'options.map((option: QuizOption, idx: number)', c)

# Fix step.question[lang] -> step.question
c = re.sub(r'step\.question\[lang\] \|\| step\.question\.en', 'step.question', c)
c = re.sub(r'step\.subtitle\[lang\] \|\| step\.subtitle\.en', 'step.subtitle', c)
c = re.sub(r'tip\.title\[lang\] \|\| tip\.title\.en', 'tip.title', c)
c = re.sub(r'tip\.summary\[lang\] \|\| tip\.summary\.en', 'tip.summary', c)
c = re.sub(r'tip\.desc\[lang\] \|\| tip\.desc\.en', 'tip.desc', c)

# Fix remaining any errors
c = re.sub(r'stepHistory\.map\(\(stepId,\s*idx\)', 'stepHistory.map((stepId: string, idx: number)', c)

with open('src/components/VirtualAssistant.tsx', 'w') as f:
    f.write(c)

