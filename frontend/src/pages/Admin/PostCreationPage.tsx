// Post Creation page - admin form for creating shelter posts
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/layout/Navbar';
import { getUsers } from '../../services/adminService';
import { createPost } from '../../services/postService';
import './PostCreationPage.css';

export default function PostCreationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        await getUsers();
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
      newErrors.title = 'Title is required';
    }

    if (!formData.content || formData.content.trim() === '') {
      newErrors.content = 'Content is required';
    }

    if (formData.image_url && formData.image_url.trim() !== '') {
      try {
        new URL(formData.image_url.trim());
      } catch {
        newErrors.image_url = 'Image URL must be a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        image_url: formData.image_url.trim() || undefined,
      });

      setSuccessMessage('Post created successfully!');
      setFormData({
        title: '',
        content: '',
        image_url: '',
      });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create post';
      if (errorMsg === 'NOT_LOGGED_IN') {
        setErrors({ general: 'Please log in to continue' });
      } else if (errorMsg === 'USER_NOT_ADMIN') {
        setErrors({ general: 'Only admins can create posts' });
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
          <h1>Create New Post</h1>
          <p className="post-creation-subtitle">
            Publish shelter news, stories, and updates for visitors.
          </p>

          {(!isAdmin || !loggedIn) && (
            <p className="post-creation-empty">
              Please log in as admin to create posts.
            </p>
          )}

          {isAdmin && loggedIn && (
            <form onSubmit={handleSubmit} className="post-creation-form">
              <div className="form-field post-creation-form__full-width">
                <label htmlFor="title">Title</label>
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
                <label htmlFor="content">Content</label>
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
                <label htmlFor="image_url">Image URL (Optional)</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image_url && <p className="form-error">{errors.image_url}</p>}
              </div>

              {errors.general && <p className="form-error form-error--general">{errors.general}</p>}
              {successMessage && <p className="form-success">{successMessage}</p>}

              <button type="submit" disabled={isSubmitting} className="post-creation-form__submit">
                {isSubmitting ? 'Creating Post...' : 'Create Post'}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="post-creation-form__secondary"
          >
            Back to Admin Dashboard
          </button>
        </section>
      </main>
    </>
  );
}
