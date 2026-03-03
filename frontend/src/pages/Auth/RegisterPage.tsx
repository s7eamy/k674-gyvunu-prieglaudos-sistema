// Register page - user registration form with validation
import { useState } from 'react';
import { register } from '../../services/authService';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

   // validate name/password on client before sending
  const validateForm = (): boolean => {
    const newErrors: { name?: string; password?: string } = {};

    // name min 3 characters
    if (!name || name.length < 3) {
      newErrors.name = 'Username must be at least 3 characters';
    }

    // pass min 8 characters + complexity
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
      await register({ name, password });
      setSuccessMessage('Registration successful');
      setName('');
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
    <div>
      <p>Register</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.name && <p>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>

        {errors.general && <div>{errors.general}</div>}
        {successMessage && <div>{successMessage}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>Password must be at least 8 chars and contain upper/lower/digit</p>
    </div>
  );
}
