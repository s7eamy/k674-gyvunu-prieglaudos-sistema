import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createOrUpdateSubscription } from '../../services/subscriptionService';
import { useEnumLabel } from '../../i18n/useEnumLabel';
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
  const { t } = useTranslation('subscribe');
  const enumLabel = useEnumLabel();
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
      setError(t('saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="subscribe-modal__backdrop">
      <div className="subscribe-modal">
        <h3>{title || t('defaultTitle')}</h3>
        <p>{t('subtitle')}</p>

        <label>{t('animalType')}</label>
        <div className="subscribe-modal__options">
          <button
            type="button"
            className={`subscribe-modal__option ${animalType === '' ? 'is-selected' : ''}`}
            onClick={() => setAnimalType('')}
          >
            {t('either')}
          </button>
          {ANIMAL_TYPES.map((option) => (
            <button
              key={option}
              type="button"
              className={`subscribe-modal__option ${animalType === option ? 'is-selected' : ''}`}
              onClick={() => setAnimalType(option)}
            >
              {enumLabel('animal_type', option)}
            </button>
          ))}
        </div>

        <label>{t('size')}</label>
        <div className="subscribe-modal__options">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`subscribe-modal__option ${sizeSet.has(option) ? 'is-selected' : ''}`}
              onClick={() => toggleValue(option, sizes, setSizes)}
            >
              {enumLabel('animal_size', option)}
            </button>
          ))}
        </div>

        <label>{t('temperament')}</label>
        <div className="subscribe-modal__options">
          {TEMPERAMENT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`subscribe-modal__option ${temperamentSet.has(option) ? 'is-selected' : ''}`}
              onClick={() => toggleValue(option, temperaments, setTemperaments)}
            >
              {enumLabel('animal_temperament', option)}
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
              {t('unsubscribe')}
            </button>
          )}
          <button className="navbar__btn navbar__btn--ghost" onClick={onClose} disabled={isSaving}>
            {t('cancel')}
          </button>
          <button className="navbar__btn navbar__btn--primary" onClick={handleSave} disabled={isSaving}>
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
