import { useEffect, useState } from 'react';
import type { Animal } from '../../types/Animal';
import './AnimalModal.css';

type AnimalModalProps = {
  animal: Animal | null;
  onClose: () => void;
};

const TEMPERAMENT_COPY: Record<string, string> = {
  calm: 'Relaxed and easy-going — perfect for a quiet home.',
  friendly: 'Loves everyone and thrives on social interaction.',
  energetic: 'Full of life — a great companion for active owners.'
};

const TEMPERAMENT_EMOJI: Record<string, string> = {
  calm: '😌',
  friendly: '🤗',
  energetic: '⚡'
};

const getAnimalEmoji = (type: string) => {
  if (type === 'dog') {
    return '🐕';
  }

  if (type === 'cat') {
    return '🐈';
  }

  return '🐾';
};

const formatSize = (size: string) => {
  if (!size) {
    return 'Unknown';
  }

  return size[0].toUpperCase() + size.slice(1);
};

const formatAddedDate = (createdAt: Date | string) => {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString();
};

function AnimalModal({ animal, onClose }: AnimalModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!animal) {
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [animal, onClose]);

  if (!animal) {
    return null;
  }
  const images = animal.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const animalType = animal.type?.toLowerCase() || '';
  const temperament = animal.temperament?.toLowerCase() || '';
  const isAdopted = Boolean(animal.adopted);
  const isVaccinated = Boolean(animal.vaccinated);

  return (
    <div className="animal-modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="animal-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${animal.name} details`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="animal-modal__close" aria-label="Close modal" onClick={onClose}>
          ✕
        </button>

        <div className="animal-modal__hero">
          {!hasImages ? (<span className="animal-modal__emoji" aria-hidden="true">
            {getAnimalEmoji(animalType)}
          </span>) : (<div className="animal-modal__carousel">
            {images.length > 1 && (
              <>
                <button className="carousel-btn prev" onClick={prevImage} aria-label="Previous image">‹</button>
                <button className="carousel-btn next" onClick={nextImage} aria-label="Next image">›</button>
              </>
            )}
            <img
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alt_text || animal.name}
              className="animal-modal__image"
            />
            {images.length > 1 && (
              <div className="carousel-indicator">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
          )}

          <span className={`animal-modal__type-badge animal-modal__type-badge--${animalType || 'other'}`}>
            {animalType || 'animal'}
          </span>
          {isAdopted ? <span className="animal-modal__adopted-badge">Adopted</span> : null}
        </div>

        <div className="animal-modal__content">
          <header className="animal-modal__heading">
            <div>
              <h2 className="animal-modal__name">{animal.name}</h2>
              <p className="animal-modal__breed">{animal.breed}</p>
            </div>
            {!isAdopted ? (
              <button type="button" className="animal-modal__adopt-btn">
                Adopt Me 🐾
              </button>
            ) : null}
          </header>

          <section className="animal-modal__stats" aria-label="Animal stats">
            <div className="animal-modal__stat-item">
              <span className="animal-modal__stat-label">Age</span>
              <strong>{animal.age} years</strong>
            </div>
            <div className="animal-modal__stat-item">
              <span className="animal-modal__stat-label">Size</span>
              <strong>{formatSize(animal.size || '')}</strong>
            </div>
            <div className="animal-modal__stat-item">
              <span className="animal-modal__stat-label">Vaccinated</span>
              <strong>{isVaccinated ? 'Yes' : 'No'}</strong>
            </div>
            <div className="animal-modal__stat-item">
              <span className="animal-modal__stat-label">Added date</span>
              <strong>{formatAddedDate(animal.created_at)}</strong>
            </div>
          </section>

          <section className="animal-modal__section">
            <h3>Temperament</h3>
            <p className="animal-modal__temperament-line">
              <span aria-hidden="true">{TEMPERAMENT_EMOJI[temperament] || '🐾'}</span>
              <strong>{temperament || 'unknown'}</strong>
            </p>
            <p>{TEMPERAMENT_COPY[temperament] || 'A unique personality waiting to meet you.'}</p>
          </section>

          <section className="animal-modal__section">
            <h3>About</h3>
            <p>{animal.description}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AnimalModal;
