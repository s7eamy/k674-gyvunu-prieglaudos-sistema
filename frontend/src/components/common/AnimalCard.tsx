import type { Animal } from '../../types/Animal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addFavoriteAnimal, removeFavoriteAnimal } from '../../services/animalService';
import { createAdoptionRequest } from '../../services/adoptionRequestService';
import { useEnumLabel } from '../../i18n/useEnumLabel';
import { translateApiError } from '../../i18n/errorMap';
import { getAnimalEmoji } from '../../utils/animalEmoji';
import './AnimalCard.css';

type AnimalCardProps = {
  animal: Animal;
  onAbout: (animal: Animal) => void;
  isFavorited: boolean;
  onFavorite: (animalId: number) => void;
  onFavoriteRemove: (animalId: number) => void;
  adoptionStatus?: 'pending' | 'approved' | null;
  onAdoptionRequest?: (animalId: number) => void;
};

const getTemperamentClass = (temperament: string) => {
  if (temperament === 'calm') return 'animal-card__tag--calm';
  if (temperament === 'friendly') return 'animal-card__tag--friendly';
  if (temperament === 'energetic') return 'animal-card__tag--energetic';
  return '';
};

function AnimalCard({ animal, onAbout, isFavorited, onFavorite, onFavoriteRemove, adoptionStatus, onAdoptionRequest }: AnimalCardProps) {
  const { t } = useTranslation('animals');
  const enumLabel = useEnumLabel();
  const animalType = animal.type?.toLowerCase() || '';
  const size = animal.size?.toLowerCase() || '';
  const temperament = animal.temperament?.toLowerCase() || '';
  const isVaccinated = Boolean(animal.vaccinated);
  const isAdopted = Boolean(animal.adopted);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingAdopt, setIsLoadingAdopt] = useState(false);
  const images = animal.images || [];
  const hasImages = images.length > 0;

  const handleAdopt = async () => {
    try {
      setIsLoadingAdopt(true);
      await createAdoptionRequest(animal.id);
      onAdoptionRequest?.(animal.id);
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

  const handleFavorite = async () => {
    try {
      setIsLoadingFavorite(true);
      if (isFavorited) {
        await removeFavoriteAnimal(animal.id);
        onFavoriteRemove(animal.id);
      } else {
        await addFavoriteAnimal(animal.id);
        onFavorite(animal.id);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'NOT_LOGGED_IN') {
        alert(t('alerts.loginToFavorite'));
      } else {
        alert(translateApiError(err));
      }
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <article className="animal-card" aria-label={t('card.ariaCard', { name: animal.name })}>
      <div className="animal-card__media">
        {!hasImages ? (
          <span className="animal-card__emoji" aria-hidden="true">
            {getAnimalEmoji(animalType)}
          </span>
        ) : (
          <img
            src={images[0].url}
            alt={images[0].alt_text || animal.name}
            className="animal-card__image"
          />
        )}

        <span className={`animal-card__type-badge animal-card__type-badge--${['cat', 'dog'].includes(animalType) ? animalType : 'other'}`}>
          {enumLabel('animal_type', animalType, 'animal')}
        </span>
        <span className="animal-card__favorite-badge">
          <button
            type="button"
            className="animal-card__favorite-btn"
            onClick={handleFavorite}
            disabled={isLoadingFavorite}
          >
            {isFavorited
              ? isLoadingFavorite
                ? t('card.favoriteRemoving')
                : t('card.favoriteRemove')
              : isLoadingFavorite
                ? t('card.favoriteAdding')
                : t('card.favoriteAdd')}
          </button>
        </span>
      </div>

      <div className="animal-card__body">
        <header className="animal-card__header">
          <h3 className="animal-card__name">{animal.name}</h3>
          <span
            className="animal-card__size-indicator"
            title={t('card.sizeTitle', { size: enumLabel('animal_size', size) })}
          >
            {enumLabel('animal_size_short', size)}
          </span>
        </header>

        <p className="animal-card__breed">{animal.breed}</p>

        <div className="animal-card__tags">
          <span className={`animal-card__tag ${getTemperamentClass(temperament)}`}>
            {enumLabel('animal_temperament', temperament)}
          </span>
          <span className="animal-card__tag animal-card__tag--age">
            {t('card.yearShort', { count: animal.age })}
          </span>
          {isVaccinated ? (
            <span className="animal-card__tag animal-card__tag--vaccinated">{t('card.vaccinated')}</span>
          ) : null}
        </div>

        {!isAdopted && (
          <button
            type="button"
            className="animal-card__adopt-btn"
            onClick={handleAdopt}
            disabled={adoptionStatus === 'pending' || isLoadingAdopt}
          >
            {adoptionStatus === 'pending'
              ? t('card.adoptPending')
              : isLoadingAdopt
                ? t('card.adoptSubmitting')
                : t('card.adopt')}
          </button>
        )}

        <button type="button" className="animal-card__about-btn" onClick={() => onAbout(animal)}>
          {t('card.about', { name: animal.name })}
        </button>
      </div>
    </article>
  );
}

export default AnimalCard;
