import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { register } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import { translateApiError } from '../../i18n/errorMap';
import './AuthPage.css';

export default function RegisterPage() {
  const { t } = useTranslation('auth');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name || name.length < 3) {
      newErrors.name = t('validation.username_min', { min: 3 });
    } else if (name.length > 50) {
      newErrors.name = t('validation.username_max', { max: 50 });
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      newErrors.email = t('validation.email_invalid');
    }

    if (!password || password.length < 8) {
      newErrors.password = t('validation.password_min', { min: 8 });
    } else if (password.length > 128) {
      newErrors.password = t('validation.password_max', { max: 128 });
    } else {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasDigit) {
        newErrors.password = t('validation.password_complexity');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      setSuccessMessage(t('register.success'));
      setName('');
      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      setErrors({ general: translateApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <section className="auth-card" aria-label={t('register.ariaForm')}>
          <h1>{t('register.title')}</h1>
          <p className="auth-card__subtitle">{t('register.subtitle')}</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form__field">
              <label htmlFor="name">{t('fields.username')}</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.name && <p className="auth-error">{errors.name}</p>}
            </div>

            <div className="auth-form__field">
              <label htmlFor="email">{t('fields.email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.email && <p className="auth-error">{errors.email}</p>}
            </div>

            <div className="auth-form__field">
              <label htmlFor="password">{t('fields.password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.password && <p className="auth-error">{errors.password}</p>}
            </div>

            {errors.general && <p className="auth-error">{errors.general}</p>}
            {successMessage && <p className="auth-success">{successMessage}</p>}

            <button type="submit" disabled={isSubmitting} className="auth-form__submit">
              {isSubmitting ? t('register.submitting') : t('register.submit')}
            </button>
          </form>

          <p className="auth-card__subtitle">{t('validation.password_complexity')}</p>
        </section>
      </main>
    </>
  );
}
