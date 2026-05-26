import i18n from './index';

type ApiErrorShape = {
  status?: number;
  message?: string;
};

const MESSAGE_MAP: Record<string, string> = {
  'Invalid credentials': 'errors:auth.invalid_credentials',
  'Username already exists': 'errors:auth.user_exists',
  'Email already exists': 'errors:auth.email_exists',
  'User with this username already exists': 'errors:auth.user_exists',
  'User with this email already exists': 'errors:auth.email_exists',
  'NOT_LOGGED_IN': 'errors:not_logged_in',
  'USER_NOT_ADMIN': 'errors:not_admin',
};

const tr = (key: string): string => i18n.t(key as never) as unknown as string;

export function translateApiError(error: unknown): string {
  if (!error) return tr('errors:generic');

  if (error instanceof Error) {
    const mappedKey = MESSAGE_MAP[error.message];
    if (mappedKey) return tr(mappedKey);
    if (error.message) return error.message;
    return tr('errors:generic');
  }

  const apiError = error as ApiErrorShape;
  if (apiError.message && MESSAGE_MAP[apiError.message]) {
    return tr(MESSAGE_MAP[apiError.message]);
  }

  if (apiError.status === 401) return tr('errors:auth.invalid_credentials');
  if (apiError.status === 403) return tr('errors:not_admin');
  if (apiError.status === 500) return tr('errors:server_unknown');
  if (apiError.status === 0) return tr('errors:network');

  if (apiError.message) return apiError.message;
  return tr('errors:generic');
}
