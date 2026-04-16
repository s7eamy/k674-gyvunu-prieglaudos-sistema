// Login page - user login form
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import './AuthPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // validate name/password on client before sending
  const validateForm = (): boolean => {
    const newErrors: { name?: string; password?: string } = {};

    // name 3-50 characters
    if (!name || name.length < 3) {
      newErrors.name = 'Username must be at least 3 characters';
    } else if (name.length > 50) {
      newErrors.name = 'Username must be at most 50 characters';
    }

    // password basic length check
    if (!password || password.length < 1) {
      newErrors.password = 'Password is required';
    } else if (password.length > 128) {
      newErrors.password = 'Password must be at most 128 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // client side validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({ name, password });
      // store token in localStorage for subsequent requests
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_email', response.user.email);
      // clear form
      setName('');
      setPassword('');
      // show logged in status on the main page
      navigate('/');
    } catch (error: unknown) {
      const errorObj = error as { status: number; message: string };
      // backend error handling
      if (errorObj.status === 401) {
        setErrors({ general: 'Invalid username or password' });
      } else if (errorObj.status === 500) {
        setErrors({ general: 'Unknown server error' });
      } else {
        setErrors({ general: errorObj.message || 'Login failed' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <section className="auth-card" aria-label="Login form">
          <h1>Login</h1>
          <p className="auth-card__subtitle">Welcome back. Continue your rescue journey.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form__field">
              <label htmlFor="name">Username</label>
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
              <label htmlFor="password">Password</label>
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
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
