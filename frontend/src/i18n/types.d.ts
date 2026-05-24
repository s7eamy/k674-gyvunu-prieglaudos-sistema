import 'i18next';

import type common from './locales/en/common.json';
import type navbar from './locales/en/navbar.json';
import type auth from './locales/en/auth.json';
import type animals from './locales/en/animals.json';
import type animalModal from './locales/en/animalModal.json';
import type match from './locales/en/match.json';
import type volunteer from './locales/en/volunteer.json';
import type donation from './locales/en/donation.json';
import type profile from './locales/en/profile.json';
import type merchandise from './locales/en/merchandise.json';
import type posts from './locales/en/posts.json';
import type leaderboard from './locales/en/leaderboard.json';
import type admin from './locales/en/admin.json';
import type enums from './locales/en/enums.json';
import type errors from './locales/en/errors.json';
import type subscribe from './locales/en/subscribe.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      navbar: typeof navbar;
      auth: typeof auth;
      animals: typeof animals;
      animalModal: typeof animalModal;
      match: typeof match;
      volunteer: typeof volunteer;
      donation: typeof donation;
      profile: typeof profile;
      merchandise: typeof merchandise;
      posts: typeof posts;
      leaderboard: typeof leaderboard;
      admin: typeof admin;
      enums: typeof enums;
      errors: typeof errors;
      subscribe: typeof subscribe;
    };
  }
}
