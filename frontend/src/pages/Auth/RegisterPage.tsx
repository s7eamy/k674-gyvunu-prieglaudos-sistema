// Register page - user registration form with validation
import { useState } from 'react';
import { register } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import './AuthPage.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

   // validate name/email/password on client before sending
  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    // name 3-50 characters
    if (!name || name.length < 3) {
      newErrors.name = 'Username must be at least 3 characters';
    } else if (name.length > 50) {
      newErrors.name = 'Username must be at most 50 characters';
    }

    // email basic validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }

    // pass 8-128 characters + complexity
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (password.length > 128) {
      newErrors.password = 'Password must be at most 128 characters';
    } else {
      // 1 uppercase, 1 lowercase, 1 digit
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasDigit) {
        newErrors.password = 'Password must contain uppercase, lowercase, and a digit';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // client side validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      setSuccessMessage('Registration successful');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      const errorObj = error as { status: number; message: string };
      // backend error handling
      if (errorObj.status === 409) {
        setErrors({ general: 'User with this username already exists' });
      } else if (errorObj.status === 500) {
        setErrors({ general: 'Unknown server error' });
      } else {
        setErrors({ general: errorObj.message || 'Registration failed' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <section className="auth-card" aria-label="Register form">
          <h1>Register</h1>
          <p className="auth-card__subtitle">Create your account and help pets find homes.</p>

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
              <label htmlFor="email">Email</label>
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
            {successMessage && <p className="auth-success">{successMessage}</p>}

            <button type="submit" disabled={isSubmitting} className="auth-form__submit">
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="auth-card__subtitle">Password must be at least 8 chars and contain upper/lower/digit</p>
        </section>
      </main>
    </>
  );
}
