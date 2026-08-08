import { useState, FormEvent } from 'react';
import SEO from '../components/SEO';
import { useI18n } from '../contexts/i18n';

export default function SuggestFeature() {
  const { t } = useI18n();
  const [category, setCategory] = useState('New Calculator');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [submitter, setSubmitter] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !details) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'suggestion_submit', {
        event_category: 'Feedback',
        category,
        title
      });
    }

    setIsSubmitted(true);
  };

  return (
    <article className="w-full h-full flex flex-col bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 max-w-2xl mx-auto space-y-8">
      <SEO
        title={t.suggestionsTitle || 'Suggest a Feature'}
        description={t.suggestionsDesc || 'Submit feature ideas and calculator requests for GlobalCalc Pro.'}
        canonicalUrl="/suggest"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: t.suggestionsTitle || 'Suggest a Feature',
          description: t.suggestionsDesc || 'Submit feature ideas and calculator requests for GlobalCalc Pro.',
          applicationCategory: 'CalculatorApplication',
          operatingSystem: 'Any',
          url: `https://globalcalcpro.com${"/suggest"}`
        }}
      />

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full mb-3">
          <span className="material-symbols-outlined text-sm">lightbulb</span>
          {t.suggestionsTitle || 'Suggest a Feature'}
        </div>
        <h1 className="text-3xl md:text-4xl font-headline text-stone-900 tracking-tight mb-3 font-bold">
          {t.suggestionsTitle || 'Suggest a Feature'}
        </h1>
        <p className="text-stone-500 font-medium text-[15px] leading-relaxed">
          {t.suggestionsExplanation || 'Have an idea for a new calculator or feature? Share your suggestion with us.'}
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-8 bg-blue-50 border border-blue-200 rounded-2xl text-stone-800 text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-blue-600">check_circle</span>
          <h2 className="font-bold text-xl text-stone-900">
            {t.suggestionSuccess || 'Thank you for your suggestion!'}
          </h2>
          <div className="pt-2">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setTitle('');
                setDetails('');
                setSubmitter('');
              }}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
            >
              {t.sendMessage || 'Submit another suggestion'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-2 block">
              {t.suggestionType || 'Category'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium cursor-pointer"
            >
              <option value="New Calculator">{t.suggestionTypeCalc || 'New Calculator Request'}</option>
              <option value="Feature Request">{t.suggestionTypeFeature || 'Feature / Improvement'}</option>
              <option value="Bug Report">{t.suggestionTypeBug || 'Bug / Issue Report'}</option>
            </select>
          </div>

          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-2 block">
              {t.suggestionTitleField || 'Suggestion Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="e.g. Add Crypto Profit Calculator"
            />
          </div>

          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-2 block">
              {t.suggestionDetailsField || 'Detailed Description'}
            </label>
            <textarea
              required
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-y"
              placeholder="..."
            ></textarea>
          </div>

          <div>
            <label className="text-xs tracking-wider uppercase font-bold text-stone-500 mb-2 block">
              {t.fullName || 'Name'} ({t.contactTitle ? 'אופציונלי' : 'Optional'})
            </label>
            <input
              type="text"
              value={submitter}
              onChange={(e) => setSubmitter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="e.g. Alex"
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">send</span>
            {t.submitGithubIssue || 'Submit Suggestion'}
          </button>
        </form>
      )}
    </article>
  );
}
