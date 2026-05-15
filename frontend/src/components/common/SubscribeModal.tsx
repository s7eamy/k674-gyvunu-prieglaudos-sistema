import { useMemo, useState } from 'react';
import { createOrUpdateSubscription } from '../../services/subscriptionService';
import './SubscribeModal.css';

type Props = {
  onClose: () => void;
  title?: string;
  initial?: {
    animalType?: string;
    sizes?: string[];
    temperaments?: string[];
  };
  onUnsubscribe?: () => void;
};

const ANIMAL_TYPES = ['dog', 'cat'];
const SIZE_OPTIONS = ['small', 'medium', 'large'];
const TEMPERAMENT_OPTIONS = ['calm', 'friendly', 'energetic'];

export default function SubscribeModal({ onClose, title, initial, onUnsubscribe }: Props) {
  const [animalType, setAnimalType] = useState(initial?.animalType || '');
  const [sizes, setSizes] = useState<string[]>(initial?.sizes || []);
  const [temperaments, setTemperaments] = useState<string[]>(initial?.temperaments || []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const sizeSet = useMemo(() => new Set(sizes), [sizes]);
  const temperamentSet = useMemo(() => new Set(temperaments), [temperaments]);

  const toggleValue = (value: string, list: string[], setList: (next: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      await createOrUpdateSubscription({
        animal_type: animalType || null,
        size: sizes.length ? sizes : null,
        temperament: temperaments.length ? temperaments : null,
      });
      onClose();
    } catch {
      setError('Failed to save subscription');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="subscribe-modal__backdrop">
      <div className="subscribe-modal">
        <h3>{title || 'Subscribe to new animals'}</h3>
        <p>Set optional criteria to only receive relevant notifications.</p>

        <label>Animal type</label>
        <div className="subscribe-modal__options">
          <button
            type="button"
            className={`subscribe-modal__option ${animalType === '' ? 'is-selected' : ''}`}
            onClick={() => setAnimalType('')}
          >
            Either
          </button>
          {ANIMAL_TYPES.map((option) => (
            <button
              key={option}
              type="button"
              className={`subscribe-modal__option ${animalType === option ? 'is-selected' : ''}`}
              onClick={() => setAnimalType(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <label>Size</label>
        <div className="subscribe-modal__options">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`subscribe-modal__option ${sizeSet.has(option) ? 'is-selected' : ''}`}
              onClick={() => toggleValue(option, sizes, setSizes)}
            >
              {option}
            </button>
          ))}
        </div>

        <label>Temperament</label>
        <div className="subscribe-modal__options">
          {TEMPERAMENT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`subscribe-modal__option ${temperamentSet.has(option) ? 'is-selected' : ''}`}
              onClick={() => toggleValue(option, temperaments, setTemperaments)}
            >
              {option}
            </button>
          ))}
        </div>

        {error && <div className="subscribe-modal__error">{error}</div>}

        <div className="subscribe-modal__actions">
          {onUnsubscribe && (
            <button
              type="button"
              className="navbar__btn navbar__btn--ghost"
              onClick={onUnsubscribe}
              disabled={isSaving}
            >
              Unsubscribe
            </button>
          )}
          <button className="navbar__btn navbar__btn--ghost" onClick={onClose} disabled={isSaving}>Cancel</button>
          <button className="navbar__btn navbar__btn--primary" onClick={handleSave} disabled={isSaving}>Save</button>
        </div>
      </div>
    </div>
  );
}
