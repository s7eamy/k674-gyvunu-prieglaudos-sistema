import { useTranslation } from 'react-i18next';
import i18n from './index';

const localeMap: Record<string, string> = {
  en: 'en-US',
  lt: 'lt-LT',
};

const localeOf = (lang?: string) => localeMap[lang ?? i18n.language] ?? 'en-US';

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const formatYmd = (d: Date) =>
  `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`;

export function formatDate(value: Date | string | null | undefined, opts?: Intl.DateTimeFormatOptions, lang?: string): string {
  if (value === null || value === undefined || value === '') return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  if (!opts) return formatYmd(d);
  return d.toLocaleDateString(localeOf(lang), opts);
}

export function formatDateTime(value: Date | string | null | undefined, lang?: string): string {
  if (value === null || value === undefined || value === '') return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const timePart = d.toLocaleTimeString(localeOf(lang));
  return `${formatYmd(d)} ${timePart}`;
}

export function formatNumber(value: number, opts?: Intl.NumberFormatOptions, lang?: string): string {
  return new Intl.NumberFormat(localeOf(lang), opts).format(value);
}

export function formatCurrency(value: number, lang?: string): string {
  return new Intl.NumberFormat(localeOf(lang), {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function useFormatters() {
  const { i18n: i18nInstance } = useTranslation();
  const lang = i18nInstance.language;
  return {
    formatDate: (value: Date | string | null | undefined, opts?: Intl.DateTimeFormatOptions) =>
      formatDate(value, opts, lang),
    formatDateTime: (value: Date | string | null | undefined) => formatDateTime(value, lang),
    formatNumber: (value: number, opts?: Intl.NumberFormatOptions) => formatNumber(value, opts, lang),
    formatCurrency: (value: number) => formatCurrency(value, lang),
  };
}
