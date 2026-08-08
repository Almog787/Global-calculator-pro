import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/i18n';

export default function Footer() {
  const { t, lang } = useI18n();

  return (
    <footer className="bg-primary-container dark:bg-primary-container mt-stack-lg w-full">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-stack-md max-w-container-max mx-auto gap-base">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to={`/${lang}`} className="font-headline-md text-headline-md font-bold text-on-primary-container hover:text-secondary-fixed transition-colors duration-200 cursor-pointer">
            {t.title}<span className="text-secondary-fixed">.</span>
          </Link>
          <p className="font-label-sm text-label-sm text-on-primary-container/80">
            &copy; {new Date().getFullYear()} GlobalCalc. {t.footerRights}
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-4">
          <Link to={`/${lang}/privacy-policy`} className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors cursor-pointer">
            {t.privacyTitle}
          </Link>
          <Link to={`/${lang}/terms-of-service`} className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors cursor-pointer">
            {t.termsTitle}
          </Link>
          <Link to={`/${lang}/contact`} className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors cursor-pointer">
            {t.contactTitle}
          </Link>
          <Link to={`/${lang}/all`} className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors cursor-pointer">
            {t.catAll}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

