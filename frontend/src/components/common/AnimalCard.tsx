import type { Animal } from '../../types/Animal';
import './AnimalCard.css';

type AnimalCardProps = {
  animal: Animal;
  onAbout: (animal: Animal) => void;
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

function AnimalCard({ animal, onAbout }: AnimalCardProps) {
  const animalType = animal.type?.toLowerCase() || '';
  const size = animal.size?.toLowerCase() || '';
  const temperament = animal.temperament?.toLowerCase() || '';
  const isVaccinated = Boolean(animal.vaccinated);

  return (
    <article className="animal-card" aria-label={`${animal.name} card`}>
      <div className="animal-card__media">
        <span className="animal-card__emoji" aria-hidden="true">
          {getAnimalEmoji(animalType)}
        </span>
        <span className={`animal-card__type-badge animal-card__type-badge--${animalType || 'other'}`}>
          {animalType || 'animal'}
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
