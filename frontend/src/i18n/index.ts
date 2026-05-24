import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEn from './locales/en/common.json';
import navbarEn from './locales/en/navbar.json';
import authEn from './locales/en/auth.json';
import animalsEn from './locales/en/animals.json';
import animalModalEn from './locales/en/animalModal.json';
import matchEn from './locales/en/match.json';
import volunteerEn from './locales/en/volunteer.json';
import donationEn from './locales/en/donation.json';
import profileEn from './locales/en/profile.json';
import merchandiseEn from './locales/en/merchandise.json';
import postsEn from './locales/en/posts.json';
import leaderboardEn from './locales/en/leaderboard.json';
import adminEn from './locales/en/admin.json';
import enumsEn from './locales/en/enums.json';
import errorsEn from './locales/en/errors.json';
import subscribeEn from './locales/en/subscribe.json';

import commonLt from './locales/lt/common.json';
import navbarLt from './locales/lt/navbar.json';
import authLt from './locales/lt/auth.json';
import animalsLt from './locales/lt/animals.json';
import animalModalLt from './locales/lt/animalModal.json';
import matchLt from './locales/lt/match.json';
import volunteerLt from './locales/lt/volunteer.json';
import donationLt from './locales/lt/donation.json';
import profileLt from './locales/lt/profile.json';
import merchandiseLt from './locales/lt/merchandise.json';
import postsLt from './locales/lt/posts.json';
import leaderboardLt from './locales/lt/leaderboard.json';
import adminLt from './locales/lt/admin.json';
import enumsLt from './locales/lt/enums.json';
import errorsLt from './locales/lt/errors.json';
import subscribeLt from './locales/lt/subscribe.json';

export const SUPPORTED_LANGUAGES = ['en', 'lt'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  en: {
    common: commonEn,
    navbar: navbarEn,
    auth: authEn,
    animals: animalsEn,
    animalModal: animalModalEn,
    match: matchEn,
    volunteer: volunteerEn,
    donation: donationEn,
    profile: profileEn,
    merchandise: merchandiseEn,
    posts: postsEn,
    leaderboard: leaderboardEn,
    admin: adminEn,
    enums: enumsEn,
    errors: errorsEn,
    subscribe: subscribeEn,
  },
  lt: {
    common: commonLt,
    navbar: navbarLt,
    auth: authLt,
    animals: animalsLt,
    animalModal: animalModalLt,
    match: matchLt,
    volunteer: volunteerLt,
    donation: donationLt,
    profile: profileLt,
    merchandise: merchandiseLt,
    posts: postsLt,
    leaderboard: leaderboardLt,
    admin: adminLt,
    enums: enumsLt,
    errors: errorsLt,
    subscribe: subscribeLt,
  },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'lt',
    supportedLngs: ['en', 'lt'],
    defaultNS: 'common',
    ns: [
      'common',
      'navbar',
      'auth',
      'animals',
      'animalModal',
      'match',
      'volunteer',
      'donation',
      'profile',
      'merchandise',
      'posts',
      'leaderboard',
      'admin',
      'enums',
      'errors',
      'subscribe',
    ],
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => (lng.toLowerCase().startsWith('en') ? 'en' : 'lt'),
    },
  });

export default i18n;
