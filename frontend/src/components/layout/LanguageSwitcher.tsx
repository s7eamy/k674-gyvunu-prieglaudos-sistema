import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n';
import './LanguageSwitcher.css';

const LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  lt: 'LT',
};

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation('navbar');
  const current = (i18n.language.startsWith('en') ? 'en' : 'lt') as SupportedLanguage;

  const handleChange = (code: SupportedLanguage) => {
    if (code !== current) {
      void i18n.changeLanguage(code);
    }
  };

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={t('aria.language_switcher', { defaultValue: 'Language' })}
    >
      {SUPPORTED_LANGUAGES.map((code) => {
        const isActive = code === current;
        return (
          <button
            key={code}
            type="button"
            className={`lang-switcher__btn ${isActive ? 'lang-switcher__btn--active' : ''}`}
            aria-pressed={isActive}
            onClick={() => handleChange(code)}
          >
            {LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
