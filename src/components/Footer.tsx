import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/i18n';

export default function Footer() {
  const { t, lang } = useI18n();

  return (
    <footer className="bg-surface-container-low w-full py-8 md:py-12 px-4 md:px-margin-desktop mt-auto border-t border-border-subtle">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col gap-2">
          <Link to={`/${lang}`} className="font-headline-md text-headline-md font-bold text-primary hover:text-secondary transition-colors duration-200 cursor-pointer">
            {t.title}<span className="text-secondary">.</span>
          </Link>
          <p className="font-body-md text-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} GlobalCalc. {t.footerRights || 'High-performance precision tools for professionals.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end items-center">
          <Link to={`/${lang}/about`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.aboutTitle || 'About Us'}
          </Link>
          <Link to={`/${lang}/terms-of-service`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.termsTitle || 'Terms of Service'}
          </Link>
          <Link to={`/${lang}/privacy-policy`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.privacyTitle || 'Privacy Policy'}
          </Link>
          <Link to={`/${lang}/contact`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.contactTitle || 'Contact Support'}
          </Link>
          <Link to={`/${lang}/suggest`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary hover:underline transition-colors">
            {t.suggestionsTitle || 'Request Calculator'}
          </Link>
        </div>
      </div>
    </footer>
  );
}
