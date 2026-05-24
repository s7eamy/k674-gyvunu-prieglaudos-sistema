import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function HtmlLangSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language.startsWith('en') ? 'en' : 'lt';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return null;
}
