import type { Animal } from '../../types/Animal';
import { useState } from 'react';
import { addFavoriteAnimal, removeFavoriteAnimal } from '../../services/animalService';
import './AnimalCard.css';

type AnimalCardProps = {
  animal: Animal;
  onAbout: (animal: Animal) => void;
  isFavorited: boolean;
  onFavorite: (animalId: number) => void;
  onFavoriteRemove: (animalId: number) => void;
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

const getSizeLabel = (size: string) => {
  if (size === 'small') {
    return 'S';
  }

  if (size === 'medium') {
    return 'M';
  }

  if (size === 'large') {
    return 'L';
  }

  return '?';
};

const getTemperamentClass = (temperament: string) => {
  if (temperament === 'calm') {
    return 'animal-card__tag--calm';
  }

  if (temperament === 'friendly') {
    return 'animal-card__tag--friendly';
  }

  if (temperament === 'energetic') {
    return 'animal-card__tag--energetic';
  }

  return '';
};

function AnimalCard({ animal, onAbout, isFavorited, onFavorite, onFavoriteRemove }: AnimalCardProps) {
  const animalType = animal.type?.toLowerCase() || '';
  const size = animal.size?.toLowerCase() || '';
  const temperament = animal.temperament?.toLowerCase() || '';
  const isVaccinated = Boolean(animal.vaccinated);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const images = animal.images || [];
  const hasImages = images.length > 0;

  const handleFavorite = async () => {
    try {
      
      setIsLoadingFavorite(true);
      if (isFavorited){
        await removeFavoriteAnimal(animal.id);
        onFavoriteRemove(animal.id);
      }
      else{
        await addFavoriteAnimal(animal.id);
        onFavorite(animal.id);
      }
    } catch (err: any) {
      if (err.message === "NOT_LOGGED_IN") {
        alert("Please log in to favorite animals.");
      } else {
        alert(err.message);
      }
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <article className="animal-card" aria-label={`${animal.name} card`}>
      <div className="animal-card__media">
        {!hasImages ? (<span className="animal-card__emoji" aria-hidden="true">
          {getAnimalEmoji(animalType)}
        </span>) : (
          <img 
            src={images[0].url}
            alt={images[0].alt_text || animal.name}
            className="animal-card__image"
          />
        )}

        <span className={`animal-card__type-badge animal-card__type-badge--${animalType || 'other'}`}>
          {animalType || 'animal'}
        </span>
        <span className="animal-card__favorite-badge">
          
          <button
              type="button"
              className="animal-card__favorite-btn"
              onClick={handleFavorite}
              disabled={isLoadingFavorite}
            >
              {isFavorited ? (isLoadingFavorite ? 'Removing...' : '★ Favorited') : (isLoadingFavorite ? 'Adding..' : '⚝ Add to favorites')}
            </button>
        </span>
        
      </div>

      <div className="animal-card__body">
        <header className="animal-card__header">
          <h3 className="animal-card__name">{animal.name}</h3>
          <span className="animal-card__size-indicator" title={`Size: ${size || 'unknown'}`}>
            {getSizeLabel(size)}
          </span>
        </header>

        <p className="animal-card__breed">{animal.breed}</p>

        <div className="animal-card__tags">
          <span className={`animal-card__tag ${getTemperamentClass(temperament)}`}>
            {temperament || 'unknown'}
          </span>
          <span className="animal-card__tag animal-card__tag--age">{animal.age}y</span>
          {isVaccinated ? (
            <span className="animal-card__tag animal-card__tag--vaccinated">💉 vaccinated</span>
          ) : null}
        </div>

        <button type="button" className="animal-card__about-btn" onClick={() => onAbout(animal)}>
          About {animal.name}
        </button>
      </div>
    </article>
  );
}

export default AnimalCard;
