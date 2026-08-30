import os

filepath = 'src/pages/CompoundInterest.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

seo_code = """
  let dynamicTitle = guide.title;
  let dynamicDesc = guide.description;

  if (principal && rate && years) {
    const formattedPrincipal = new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-US').format(principal);
    dynamicTitle = (lang === 'he') 
      ? `מחשבון ריבית דריבית: ${formattedPrincipal} ב-${rate}% ל-${years} שנים` 
      : `Compound Interest: ${formattedPrincipal} at ${rate}% for ${years} Years`;
    
    const formattedFV = new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-US', { maximumFractionDigits: 0 }).format(futureValue);
    dynamicDesc = (lang === 'he') 
      ? `חישוב מהיר: השקעה של ${formattedPrincipal} בריבית ${rate}% תצמח ל-${formattedFV} תוך ${years} שנים.`
      : `Quick calculation: ${formattedPrincipal} invested at ${rate}% will grow to ${formattedFV} in ${years} years.`;
  }

  return (
    <div className="w-full">
      <SEO
        title={dynamicTitle}
        description={dynamicDesc}
      />
"""

content = content.replace("  return (\n    <div className=\"w-full\">\n      <SEO\n        title={guide.title}\n        description={guide.description}\n      />", seo_code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched CompoundInterest.tsx")
