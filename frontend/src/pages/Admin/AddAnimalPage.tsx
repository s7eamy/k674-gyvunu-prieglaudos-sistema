// Add Animal page - admin form for adding new animals to the shelter
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAnimal, getUsers } from '../../services/adminService';
import Navbar from '../../components/layout/Navbar';
import './AddAnimalPage.css';

export default function AddAnimalPage() {
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
    images: [] as File[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  const typeOptions = ['dog', 'cat', 'other'];
  const sizeOptions = ['small', 'medium', 'large'];
  const temperamentOptions = ['calm', 'friendly', 'energetic'];

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

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (!formData.type || formData.type === '') {
      newErrors.type = 'Type is required';
    }

    if (!formData.breed || formData.breed.trim() === '') {
      newErrors.breed = 'Breed is required';
    }

    if (!formData.size || formData.size === '') {
      newErrors.size = 'Size is required';
    }

    if (!formData.age || formData.age === '') {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 0) {
        newErrors.age = 'Age must be a valid non-negative number';
      }
    }

    if (!formData.temperament || formData.temperament === '') {
      newErrors.temperament = 'Temperament is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'vaccinated' ? parseInt(value) : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    // Convert FileList to Array
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: selectedFiles
    }));
  }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});  
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

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
    
    if (formData.images && formData.images.length > 0) {
    formData.images.forEach((file) => {
      dataForImages.append('images', file);
    });
  }

    try {
      await addAnimal(dataForImages);

      setSuccessMessage('Animal added successfully!');
      // Reset form
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        size: 'medium',
        age: '',
        vaccinated: 0,
        temperament: 'calm',
        description: '',
        images: []
      });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add animal';
      if (errorMsg === 'NOT_LOGGED_IN') {
        setErrors({ general: 'Please log in to continue' });
      } else if (errorMsg === 'USER_NOT_ADMIN') {
        setErrors({ general: 'Only admins can add animals' });
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
          <h1>Add New Animal</h1>
          <p className="add-animal-subtitle">
            Help more pets find loving homes by adding them to the shelter.
          </p>
          {(!isAdmin || !loggedIn) && (
            <p className="add-animal-empty">
              Please log in as admin to add animals.
            </p>
          )}

          {isAdmin && loggedIn && (
            <form onSubmit={handleSubmit} className="add-animal-form">
            {/* Name field */}
            <div className="form-field">
              <label htmlFor="name">Name</label>
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

            {/* Type field */}
            <div className="form-field">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {errors.type && <p className="form-error">{errors.type}</p>}
            </div>

            {/* Breed field */}
            <div className="form-field">
              <label htmlFor="breed">Breed</label>
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

            {/* Size field */}
            <div className="form-field">
              <label htmlFor="size">Size</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {sizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {errors.size && <p className="form-error">{errors.size}</p>}
            </div>

            {/* Age field */}
            <div className="form-field">
              <label htmlFor="age">Age (years)</label>
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

            {/* Vaccinated field */}
            <div className="form-field">
              <label htmlFor="vaccinated">Vaccinated</label>
              <select
                id="vaccinated"
                name="vaccinated"
                value={formData.vaccinated}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
              {errors.vaccinated && <p className="form-error">{errors.vaccinated}</p>}
            </div>

            {/* Temperament field */}
            <div className="form-field">
              <label htmlFor="temperament">Temperament</label>
              <select
                id="temperament"
                name="temperament"
                value={formData.temperament}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {temperamentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {errors.temperament && <p className="form-error">{errors.temperament}</p>}
            </div>

            {/* Description field */}
            <div className="form-field">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Add any special notes about this animal..."
                rows={4}
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            {/* Image field */}
            <div className="form-field">
              <label htmlFor="image">Image Upload</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  multiple // allows multiple images
                  accept="image/*" // only images
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              {errors.image && <p className="form-error">{errors.image}</p>}
            </div>

            {/* General error message */}
            {errors.general && <p className="form-error form-error--general">{errors.general}</p>}

            {/* Success message */}
            {successMessage && <p className="form-success">{successMessage}</p>}

            {/* Submit button */}
            <button type="submit" disabled={isSubmitting} className="add-animal-form__submit">
              {isSubmitting ? 'Adding Animal...' : 'Add Animal'}
            </button>
          </form>
          )}

          <br></br>
          {/* Navigation button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="add-animal-form__secondary"
          >
            View All Animals
          </button>
        </section>
      </main>
    </>
  );
}
