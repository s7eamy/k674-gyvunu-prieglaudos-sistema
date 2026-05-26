import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import { translateApiError } from '../../i18n/errorMap';
import './AuthPage.css';

export default function LoginPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; password?: string } = {};

    if (!name || name.length < 3) {
      newErrors.name = t('validation.username_min', { min: 3 });
    } else if (name.length > 50) {
      newErrors.name = t('validation.username_max', { max: 50 });
    }

    if (!password || password.length < 1) {
      newErrors.password = t('validation.password_required');
    } else if (password.length > 128) {
      newErrors.password = t('validation.password_max', { max: 128 });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({ name, password });
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_role', response.user.role);
      localStorage.setItem('user_name', response.user.name);
      localStorage.setItem('user_email', response.user.email);
      setName('');
      setPassword('');
      navigate('/');
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
        <section className="auth-card" aria-label={t('login.ariaForm')}>
          <h1>{t('login.title')}</h1>
          <p className="auth-card__subtitle">{t('login.subtitle')}</p>

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

            <button type="submit" disabled={isSubmitting} className="auth-form__submit">
              {isSubmitting ? t('login.submitting') : t('login.submit')}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
