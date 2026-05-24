import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Animal } from '../../types/Animal';
import { createAdoptionRequest } from '../../services/adoptionRequestService';
import { useEnumLabel } from '../../i18n/useEnumLabel';
import { useFormatters } from '../../i18n/formatters';
import { translateApiError } from '../../i18n/errorMap';
import { getAnimalEmoji } from '../../utils/animalEmoji';
import './AnimalModal.css';

type AnimalModalProps = {
  animal: Animal | null;
  onClose: () => void;
  onAdopt?: (animalId: number) => void;
  adoptionStatus?: 'pending' | 'approved' | null;
};

const TEMPERAMENT_EMOJI: Record<string, string> = {
  calm: '😌',
  friendly: '🤗',
  energetic: '⚡',
};

function AnimalModal({ animal, onClose, onAdopt, adoptionStatus }: AnimalModalProps) {
  const { t } = useTranslation('animalModal');
  const enumLabel = useEnumLabel();
  const { formatDate } = useFormatters();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoadingAdopt, setIsLoadingAdopt] = useState(false);

  const handleAdopt = async () => {
    if (!animal || !onAdopt) return;
    try {
      setIsLoadingAdopt(true);
      await createAdoptionRequest(animal.id);
      onAdopt(animal.id);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'NOT_LOGGED_IN') {
        alert(t('alerts.loginToAdopt'));
      } else {
        alert(translateApiError(err));
      }
    } finally {
      setIsLoadingAdopt(false);
    }
  };

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
        aria-label={t('aria.dialog', { name: animal.name })}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="animal-modal__close" aria-label={t('aria.close')} onClick={onClose}>
          ✕
        </button>

        <div className="animal-modal__hero">
          {!hasImages ? (
            <span className="animal-modal__emoji" aria-hidden="true">
              {getAnimalEmoji(animalType)}
            </span>
          ) : (
            <div className="animal-modal__carousel">
              {images.length > 1 && (
                <>
                  <button className="carousel-btn prev" onClick={prevImage} aria-label={t('aria.prev')}>‹</button>
                  <button className="carousel-btn next" onClick={nextImage} aria-label={t('aria.next')}>›</button>
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
            {enumLabel('animal_type', animalType, 'animal')}
          </span>
          {isAdopted ? <span className="animal-modal__adopted-badge">{t('badges.adopted')}</span> : null}
        </div>

        <div className="animal-modal__content">
          <header className="animal-modal__heading">
            <div>
              <h2 className="animal-modal__name">{animal.name}</h2>
              <p className="animal-modal__breed">{animal.breed}</p>
            </div>
            {!isAdopted ? (
              <button
                type="button"
                className="animal-modal__adopt-btn"
                onClick={handleAdopt}
                disabled={adoptionStatus === 'pending' || !onAdopt || isLoadingAdopt}
              >
                {adoptionStatus === 'pending'
                  ? t('actions.adoptPending')
                  : isLoadingAdopt
                    ? t('actions.adoptSubmitting')
                    : t('actions.adopt')}
              </button>
            ) : null}
          </header>

          <section className="animal-modal__stats" aria-label={t('aria.stats')}>
            <div className="animal-modal__stat-item">
              <span className="animal-modal__stat-label">{t('stats.age')}</span>
              <strong>{t('ageValue', { count: animal.age })}</strong>
            </div>
            <div className="animal-modal__stat-item">
              <span className="animal-modal__stat-label">{t('stats.size')}</span>
              <strong>{enumLabel('animal_size', animal.size)}</strong>
            </div>
            <div className="animal-modal__stat-item">
              <span className="animal-modal__stat-label">{t('stats.vaccinated')}</span>
              <strong>{enumLabel('vaccinated', isVaccinated ? 'yes' : 'no')}</strong>
            </div>
            <div className="animal-modal__stat-item">
              <span className="animal-modal__stat-label">{t('stats.added')}</span>
              <strong>{formatDate(animal.created_at)}</strong>
            </div>
          </section>

          <section className="animal-modal__section">
            <h3>{t('sections.temperament')}</h3>
            <p className="animal-modal__temperament-line">
              <span aria-hidden="true">{TEMPERAMENT_EMOJI[temperament] || '🐾'}</span>
              <strong>{enumLabel('animal_temperament', temperament)}</strong>
            </p>
            <p>
              {(() => {
                const key = (temperament || 'unknown') as 'calm' | 'friendly' | 'energetic' | 'unknown';
                return t(`temperament_description.${key}`);
              })()}
            </p>
          </section>

          <section className="animal-modal__section">
            <h3>{t('sections.about')}</h3>
            <p>{animal.description}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AnimalModal;
