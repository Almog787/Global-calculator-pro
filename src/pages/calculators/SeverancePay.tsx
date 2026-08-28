import React, { useState } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';
import ShareActions from '../../components/ShareActions';

export default function SeverancePay() {
  const { lang } = useI18n();
  const [salary, setSalary] = useState<number>(15000);
  const [years, setYears] = useState<number>(3);
  const [months, setMonths] = useState<number>(0);

  const totalYears = years + (months / 12);
  const severance = salary * totalYears;

  const defaultCurrency = lang === 'he' ? '₪' : '$';

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-border-subtle">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
            {lang === 'he' ? 'מחשבון פיצויי פיטורים' : 'Severance Pay Calculator'}
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            {lang === 'he' ? 'הערכת פיצויים בסיסית לפי שנות ותק ושכר אחרון' : 'Basic severance estimation based on tenure and last salary'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              {lang === 'he' ? 'שכר חודשי אחרון (ברוטו)' : 'Last Monthly Salary (Gross)'}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-on-surface-variant font-medium">
                {defaultCurrency}
              </span>
              <input
                type="number"
                min="0"
                value={salary || ''}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-border-subtle rounded-xl ltr:pl-8 rtl:pr-8 px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                {lang === 'he' ? 'שנות עבודה' : 'Years Worked'}
              </label>
              <input
                type="number"
                min="0"
                value={years || ''}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                {lang === 'he' ? 'חודשים נוספים' : 'Additional Months'}
              </label>
              <input
                type="number"
                min="0"
                max="11"
                value={months || ''}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-lg font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 flex flex-col justify-center border border-emerald-100 dark:border-emerald-900/30">
          <h3 className="text-emerald-800 dark:text-emerald-300 font-medium mb-2">
            {lang === 'he' ? 'סך הפיצויים המוערך' : 'Estimated Total Severance'}
          </h3>
          <div className="text-4xl sm:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
            {defaultCurrency}{Math.round(severance).toLocaleString()}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-400/70 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {lang === 'he' ? `עבור ${totalYears.toFixed(2)} שנות ותק` : `For ${totalYears.toFixed(2)} years of tenure`}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-on-surface-variant/70 mt-4">
        {lang === 'he' 
          ? '* שימו לב: החישוב הוא הערכה כללית המבוססת על חוק פיצויי פיטורים הבסיסי (משכורת חודש לכל שנת עבודה). הסכום בפועל עשוי להשתנות בהתאם להפרשות הפנסיוניות לקופה (סעיף 14), ימי חופשה, תנאים נלווים והסכמים אישיים.'
          : '* Note: This is a basic estimation (one month salary per year worked). Actual severance may vary based on local labor laws, pension contributions, unused vacation days, and personal contracts.'}
      </p>

      <ShareActions />
    </div>
  );
}
