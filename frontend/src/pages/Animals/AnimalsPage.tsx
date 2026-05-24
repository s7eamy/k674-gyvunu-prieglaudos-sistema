import { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getAll, getFavoriteAnimals, type AnimalFilters } from '../../services/animalService';
import { getUserAdoptionRequests } from '../../services/adoptionRequestService';
import type { Animal } from '../../types/Animal';
import Navbar from '../../components/layout/Navbar';
import AnimalCard from '../../components/common/AnimalCard';
import AnimalModal from '../../components/common/AnimalModal';
import SubscribeModal from '../../components/common/SubscribeModal';
import { useEnumLabel } from '../../i18n/useEnumLabel';
import { getAnimalEmoji } from '../../utils/animalEmoji';
import './AnimalsPage.css';

export default function AnimalsPage() {
  const { t } = useTranslation('animals');
  const enumLabel = useEnumLabel();
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [adoptionStatusMap, setAdoptionStatusMap] = useState<Record<number, 'pending' | 'approved'>>({});
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [filters, setFilters] = useState<AnimalFilters>({
    type: '',
    size: '',
    temperament: '',
    vaccinated: undefined,
    adopted: 0,
    ageMin: undefined,
    ageMax: undefined,
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavoriteAnimals();
        setFavoriteIds(favorites.map((fav) => fav.id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const requests = await getUserAdoptionRequests();
        const statusMap: Record<number, 'pending' | 'approved'> = {};
        for (const req of requests) {
          if (req.status === 'pending' || req.status === 'approved') {
            if (!statusMap[req.animal_id]) {
              statusMap[req.animal_id] = req.status;
            }
          }
        }
        setAdoptionStatusMap(statusMap);
      } catch {
        // Not logged in or other error — no adoption statuses to show
      }
    };
    fetchAdoptionRequests();
  }, []);

  const handleAdoptionRequest = (animalId: number) => {
    setAdoptionStatusMap((prev) => ({ ...prev, [animalId]: 'pending' }));
  };

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await getAll({
          type: filters.type || undefined,
          size: filters.size || undefined,
          temperament: filters.temperament || undefined,
          vaccinated: filters.vaccinated,
          adopted: filters.adopted,
          ageMin: filters.ageMin,
          ageMax: filters.ageMax,
        });
        setAnimals(data);
      } catch (error) {
        console.error('Fetch failed', error);
      }
    };

    fetchAnimals();
  }, [filters]);

  const hasActiveFilters =
    Boolean(filters.type) ||
    Boolean(filters.size) ||
    Boolean(filters.temperament) ||
    filters.vaccinated !== undefined ||
    filters.adopted !== 0 ||
    filters.ageMin !== undefined ||
    filters.ageMax !== undefined;

  return (
    <>
      <Navbar />

      <main className="animals-page">
        <header className="animals-page__header">
          <div className="animals-page__hero-content">
            <div className="animals-page__hero-left">
              <h1>
                <Trans i18nKey="hero.title" t={t}>
                  Find your <span>FOREVER</span> companion
                </Trans>
              </h1>
              <p>{t('hero.subtitle')}</p>

              <div className="animals-page__stats">
                <div className="stat-item">
                  <span className="stat-number">243</span>
                  <span className="stat-label">{t('hero.stats.available')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1,950</span>
                  <span className="stat-label">{t('hero.stats.adopted_this_year')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">38</span>
                  <span className="stat-label">{t('hero.stats.foster_needed')}</span>
                </div>
              </div>
              <div className="animals-page__subscribe">
                <button
                  type="button"
                  className="animals-page__subscribe-btn"
                  onClick={() => setIsSubscribeOpen(true)}
                >
                  {t('hero.subscribe')}
                </button>
              </div>
            </div>

            {animals.length > 0 && (
              <div className="animals-page__hero-featured">
                <div className="featured-card">
                  <div className="featured-card__label">{t('featured.label')}</div>

                  <div className="featured-card__image">
                    <span className="featured-card__emoji">{getAnimalEmoji(animals[0].type)}</span>
                  </div>

                  <div className="featured-card__body">
                    <h2 className="featured-card__name">{animals[0].name}</h2>
                    <p className="featured-card__breed">{animals[0].breed}</p>

                    <div className="featured-card__tags">
                      <span className="featured-card__tag" data-type="temperament">
                        {enumLabel('animal_temperament', animals[0].temperament)}
                      </span>
                      <span className="featured-card__tag" data-type="age">
                        {t('card.yearShort', { count: animals[0].age })}
                      </span>
                      {animals[0].vaccinated ? (
                        <span className="featured-card__tag" data-type="vaccinated">{t('card.vaccinated')}</span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="featured-card__btn"
                      onClick={() => setSelectedAnimal(animals[0])}
                    >
                      {t('featured.viewProfile', { name: animals[0].name })}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="animals-page__filters-wrapper">
          <div className="animals-page__content">
            <section className="animals-page__filters" aria-label={t('aria.filters')}>
              <select
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="">{t('filters.allTypes')}</option>
                <option value="dog">{enumLabel('animal_type', 'dog')}</option>
                <option value="cat">{enumLabel('animal_type', 'cat')}</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => setFilters((f) => ({ ...f, size: e.target.value }))}
              >
                <option value="">{t('filters.allSizes')}</option>
                <option value="small">{enumLabel('animal_size', 'small')}</option>
                <option value="medium">{enumLabel('animal_size', 'medium')}</option>
                <option value="large">{enumLabel('animal_size', 'large')}</option>
              </select>

              <select
                value={filters.temperament}
                onChange={(e) => setFilters((f) => ({ ...f, temperament: e.target.value }))}
              >
                <option value="">{t('filters.allTemperaments')}</option>
                <option value="calm">{enumLabel('animal_temperament', 'calm')}</option>
                <option value="friendly">{enumLabel('animal_temperament', 'friendly')}</option>
                <option value="energetic">{enumLabel('animal_temperament', 'energetic')}</option>
              </select>

              <select
                value={filters.vaccinated === undefined ? '' : String(filters.vaccinated)}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    vaccinated: e.target.value === '' ? undefined : (Number(e.target.value) as 0 | 1),
                  }))
                }
              >
                <option value="">{t('filters.allVaccinated')}</option>
                <option value="1">{t('filters.vaccinatedOnly')}</option>
                <option value="0">{t('filters.notVaccinated')}</option>
              </select>

              <select
                value={filters.adopted === undefined ? '' : String(filters.adopted)}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    adopted: e.target.value === '' ? undefined : (Number(e.target.value) as 0 | 1),
                  }))
                }
              >
                <option value="0">{t('filters.available')}</option>
                <option value="1">{t('filters.adopted_status')}</option>
                <option value="">{t('filters.allAdoption')}</option>
              </select>

              <select
                value={
                  filters.ageMin === 0 && filters.ageMax === 2
                    ? 'young'
                    : filters.ageMin === 3 && filters.ageMax === 7
                      ? 'adult'
                      : filters.ageMin === 8 && filters.ageMax === undefined
                        ? 'senior'
                        : ''
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'young') {
                    setFilters((f) => ({ ...f, ageMin: 0, ageMax: 2 }));
                  } else if (value === 'adult') {
                    setFilters((f) => ({ ...f, ageMin: 3, ageMax: 7 }));
                  } else if (value === 'senior') {
                    setFilters((f) => ({ ...f, ageMin: 8, ageMax: undefined }));
                  } else {
                    setFilters((f) => ({ ...f, ageMin: undefined, ageMax: undefined }));
                  }
                }}
              >
                <option value="">{t('filters.allAges')}</option>
                <option value="young">{t('filters.ageYoung')}</option>
                <option value="adult">{t('filters.ageAdult')}</option>
                <option value="senior">{t('filters.ageSenior')}</option>
              </select>

              {hasActiveFilters ? (
                <button
                  type="button"
                  className="animals-page__reset"
                  onClick={() =>
                    setFilters({
                      type: '',
                      size: '',
                      temperament: '',
                      vaccinated: undefined,
                      adopted: 0,
                      ageMin: undefined,
                      ageMax: undefined,
                    })
                  }
                >
                  {t('filters.reset')}
                </button>
              ) : null}
            </section>
          </div>
        </div>

        <div className="animals-page__grid-wrapper">
          <div className="animals-page__content">
            {animals.length === 0 ? (
              <p className="animals-page__empty">{t('list.empty')}</p>
            ) : (
              <section className="animals-page__grid" aria-label={t('aria.grid')}>
                {animals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onAbout={(a) => setSelectedAnimal(a)}
                    isFavorited={favoriteIds.includes(animal.id)}
                    onFavorite={(id) => {
                      setFavoriteIds((prev) => [...prev, id]);
                    }}
                    onFavoriteRemove={(id) => {
                      setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
                    }}
                    adoptionStatus={adoptionStatusMap[animal.id] ?? null}
                    onAdoptionRequest={handleAdoptionRequest}
                  />
                ))}
              </section>
            )}
          </div>
        </div>
      </main>

      <AnimalModal
        key={selectedAnimal?.id}
        animal={selectedAnimal}
        onClose={() => setSelectedAnimal(null)}
        onAdopt={handleAdoptionRequest}
        adoptionStatus={selectedAnimal ? (adoptionStatusMap[selectedAnimal.id] ?? null) : null}
      />
      {isSubscribeOpen && <SubscribeModal onClose={() => setIsSubscribeOpen(false)} />}
    </>
  );
}
