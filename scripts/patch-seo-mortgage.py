import os

filepath = 'src/pages/MortgageCalculator.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

seo_code = """
  let dynamicTitle = guide.title;
  let dynamicDesc = guide.description;

  if (principal && rate && years) {
    const formattedPrincipal = new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-US').format(principal);
    dynamicTitle = (lang === 'he') 
      ? `מחשבון משכנתא: ${formattedPrincipal} ב-${rate}% ל-${years} שנים` 
      : `Mortgage Calculator: ${formattedPrincipal} at ${rate}% for ${years} Years`;
    
    const formattedPayment = new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(monthlyPayment).replace('$', '');
    dynamicDesc = (lang === 'he') 
      ? `חישוב מהיר: החזר חודשי משוער של ₪${formattedPayment} למשכנתא של ${formattedPrincipal} בריבית ${rate}%.`
      : `Quick calculation: Estimated monthly payment of $${formattedPayment} for a ${formattedPrincipal} mortgage at ${rate}%.`;
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
print("Patched MortgageCalculator.tsx")
