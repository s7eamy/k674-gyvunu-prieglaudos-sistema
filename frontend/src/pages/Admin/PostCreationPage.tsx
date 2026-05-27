import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Navbar from '../../components/layout/Navbar';
import { getUsers } from '../../services/adminService';
import { createPost } from '../../services/postService';
import './PostCreationPage.css';

export default function PostCreationPage() {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        await getUsers();
        setLoggedIn(true);
        setIsAdmin(true);
      } catch (error) {
        if (error instanceof Error && error.message === 'NOT_LOGGED_IN') {
          setLoggedIn(false);
        } else if (error instanceof Error && error.message === 'USER_NOT_ADMIN') {
          setIsAdmin(false);
        } else {
          console.error('Admin access check failed', error);
        }
      }
    };

    checkAdminAccess();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = t('postCreation.validation.titleRequired');
    }

    if (!formData.content || formData.content.trim() === '') {
      newErrors.content = t('postCreation.validation.contentRequired');
    }

    if (formData.image_url && formData.image_url.trim() !== '') {
      try {
        new URL(formData.image_url.trim());
      } catch {
        newErrors.image_url = t('postCreation.validation.imageUrlInvalid');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        image_url: formData.image_url.trim() || undefined,
      });

      setSuccessMessage(t('postCreation.success'));
      setFormData({ title: '', content: '', image_url: '' });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : t('postCreation.errors.generic');
      if (errorMsg === 'NOT_LOGGED_IN') {
        setErrors({ general: t('postCreation.errors.notLoggedIn') });
      } else if (errorMsg === 'USER_NOT_ADMIN') {
        setErrors({ general: t('postCreation.errors.notAdmin') });
      } else {
        setErrors({ general: errorMsg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="post-creation-page">
        <section className="post-creation-card">
          <h1>{t('postCreation.title')}</h1>
          <p className="post-creation-subtitle">{t('postCreation.subtitle')}</p>

          {(!isAdmin || !loggedIn) && (
            <p className="post-creation-empty">{t('postCreation.loginPrompt')}</p>
          )}

          {isAdmin && loggedIn && (
            <form onSubmit={handleSubmit} className="post-creation-form">
              <div className="form-field post-creation-form__full-width">
                <label htmlFor="title">{t('postCreation.fields.title')}</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.title && <p className="form-error">{errors.title}</p>}
              </div>

              <div className="form-field post-creation-form__full-width">
                <label htmlFor="content">{t('postCreation.fields.content')}</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={8}
                />
                {errors.content && <p className="form-error">{errors.content}</p>}
              </div>

              <div className="form-field post-creation-form__full-width">
                <label htmlFor="image_url">{t('postCreation.fields.imageUrl')}</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder={t('postCreation.fields.imageUrlPlaceholder')}
                />
                {errors.image_url && <p className="form-error">{errors.image_url}</p>}
              </div>

              {errors.general && <p className="form-error form-error--general">{errors.general}</p>}
              {successMessage && <p className="form-success">{successMessage}</p>}

              <button type="submit" disabled={isSubmitting} className="post-creation-form__submit">
                {isSubmitting ? t('postCreation.submitting') : t('postCreation.submit')}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="post-creation-form__secondary"
          >
            {t('postCreation.backToDashboard')}
          </button>
        </section>
      </main>
    </>
  );
}
