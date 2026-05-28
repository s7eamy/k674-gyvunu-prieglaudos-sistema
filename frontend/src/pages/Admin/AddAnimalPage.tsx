import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addAnimal, getUsers } from '../../services/adminService';
import Navbar from '../../components/layout/Navbar';
import { useEnumLabel } from '../../i18n/useEnumLabel';
import './AddAnimalPage.css';

export default function AddAnimalPage() {
  const { t } = useTranslation('admin');
  const enumLabel = useEnumLabel();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    size: 'medium',
    age: '',
    vaccinated: 0,
    temperament: 'calm',
    description: '',
    description_lt: '',
    images: [] as File[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const typeOptions = ['dog', 'cat', 'other'];
  const sizeOptions = ['small', 'medium', 'large'];
  const temperamentOptions = ['calm', 'friendly', 'energetic'];

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        await getUsers();
        setIsAdmin(true);
        setLoggedIn(true);
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

    if (!formData.name || formData.name.trim() === '') newErrors.name = t('addAnimal.validation.nameRequired');
    if (!formData.type || formData.type === '') newErrors.type = t('addAnimal.validation.typeRequired');
    if (!formData.breed || formData.breed.trim() === '') newErrors.breed = t('addAnimal.validation.breedRequired');
    if (!formData.size || formData.size === '') newErrors.size = t('addAnimal.validation.sizeRequired');

    if (!formData.age || formData.age === '') {
      newErrors.age = t('addAnimal.validation.ageRequired');
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 0) {
        newErrors.age = t('addAnimal.validation.ageInvalid');
      }
    }

    if (!formData.temperament || formData.temperament === '') {
      newErrors.temperament = t('addAnimal.validation.temperamentRequired');
    }
     
    if (formData.description_lt === '' && formData.description !== ''){
      newErrors.description_lt = t('addAnimal.validation.description_ltRequired');
    }

    if (formData.description_lt !== '' && formData.description === ''){
      newErrors.description = t('addAnimal.validation.descriptionRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'vaccinated' ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: selectedFiles }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    const dataForImages = new FormData();

    dataForImages.append('name', formData.name);
    dataForImages.append('type', formData.type);
    dataForImages.append('breed', formData.breed);
    dataForImages.append('size', formData.size);
    dataForImages.append('age', formData.age);
    dataForImages.append('vaccinated', String(formData.vaccinated));
    dataForImages.append('temperament', formData.temperament);
    dataForImages.append('description', formData.description);
    dataForImages.append('description_lt', formData.description_lt);

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => {
        dataForImages.append('images', file);
      });
    }

    try {
      await addAnimal(dataForImages);
      setSuccessMessage(t('addAnimal.success'));
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        size: 'medium',
        age: '',
        vaccinated: 0,
        temperament: 'calm',
        description: '',
        description_lt: '',
        images: [],
      });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : t('addAnimal.errors.generic');
      if (errorMsg === 'NOT_LOGGED_IN') {
        setErrors({ general: t('addAnimal.errors.notLoggedIn') });
      } else if (errorMsg === 'USER_NOT_ADMIN') {
        setErrors({ general: t('addAnimal.errors.notAdmin') });
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
      <main className="add-animal-page">
        <section className="add-animal-card">
          <h1>{t('addAnimal.title')}</h1>
          <p className="add-animal-subtitle">{t('addAnimal.subtitle')}</p>
          {(!isAdmin || !loggedIn) && (
            <p className="add-animal-empty">{t('addAnimal.loginPrompt')}</p>
          )}

          {isAdmin && loggedIn && (
            <form onSubmit={handleSubmit} className="add-animal-form">
              <div className="form-field">
                <label htmlFor="name">{t('addAnimal.fields.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="type">{t('addAnimal.fields.type')}</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {enumLabel('animal_type', option)}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="form-error">{errors.type}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="breed">{t('addAnimal.fields.breed')}</label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.breed && <p className="form-error">{errors.breed}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="size">{t('addAnimal.fields.size')}</label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {sizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {enumLabel('animal_size', option)}
                    </option>
                  ))}
                </select>
                {errors.size && <p className="form-error">{errors.size}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="age">{t('addAnimal.fields.age')}</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                />
                {errors.age && <p className="form-error">{errors.age}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="vaccinated">{t('addAnimal.fields.vaccinated')}</label>
                <select
                  id="vaccinated"
                  name="vaccinated"
                  value={formData.vaccinated}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value={0}>{enumLabel('vaccinated', 'no')}</option>
                  <option value={1}>{enumLabel('vaccinated', 'yes')}</option>
                </select>
                {errors.vaccinated && <p className="form-error">{errors.vaccinated}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="temperament">{t('addAnimal.fields.temperament')}</label>
                <select
                  id="temperament"
                  name="temperament"
                  value={formData.temperament}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {temperamentOptions.map((option) => (
                    <option key={option} value={option}>
                      {enumLabel('animal_temperament', option)}
                    </option>
                  ))}
                </select>
                {errors.temperament && <p className="form-error">{errors.temperament}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="description">{t('addAnimal.fields.description')}</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder={t('addAnimal.fields.descriptionPlaceholder')}
                  rows={4}
                />
                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="description_lt">{t('addAnimal.fields.description_lt')}</label>
                <textarea
                  id="description_lt"
                  name="description_lt"
                  value={formData.description_lt}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder={t('addAnimal.fields.description_ltPlaceholder')}
                  rows={4}
                />
                {errors.description_lt && <p className="form-error">{errors.description_lt}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="image">{t('addAnimal.fields.image')}</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                {errors.image && <p className="form-error">{errors.image}</p>}
              </div>

              {errors.general && <p className="form-error form-error--general">{errors.general}</p>}

              {successMessage && <p className="form-success">{successMessage}</p>}

              <button type="submit" disabled={isSubmitting} className="add-animal-form__submit">
                {isSubmitting ? t('addAnimal.submitting') : t('addAnimal.submit')}
              </button>
            </form>
          )}

          <br />
          <button
            type="button"
            onClick={() => navigate('/animals')}
            className="add-animal-form__secondary"
          >
            {t('addAnimal.viewAll')}
          </button>
        </section>
      </main>
    </>
  );
}
