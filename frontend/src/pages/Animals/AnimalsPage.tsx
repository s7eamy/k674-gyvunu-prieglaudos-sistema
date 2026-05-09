// Animals page — main page component for listing, creating, editing, and deleting animals
import { useState, useEffect } from 'react';
import { getAll, getFavoriteAnimals,  type AnimalFilters } from '../../services/animalService';
import { getUserAdoptionRequests } from '../../services/adoptionRequestService';
import type { Animal } from '../../types/Animal';
import Navbar from '../../components/layout/Navbar';
import AnimalCard from '../../components/common/AnimalCard';
import AnimalModal from '../../components/common/AnimalModal';
import './AnimalsPage.css';

export default function AnimalsPage() {
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
              <h1>Find your<span>FOREVER</span>companion</h1>
              <p>Every animal here is waiting for a loving home. Browse, connect and change a life - including yours.</p>
              
              <div className="animals-page__stats">
                <div className="stat-item">
                  <span className="stat-number">243</span>
                  <span className="stat-label">Available now</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1,950</span>
                  <span className="stat-label">Adopted This Year</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">38</span>
                  <span className="stat-label">Foster Homes Needed</span>
                </div>
              </div>
            </div>
            
            {animals.length > 0 && (
              <div className="animals-page__hero-featured">
                <div className="featured-card">
                  <div className="featured-card__label">Featured Today ⭐</div>
                  
                  <div className="featured-card__image">
                    <span className="featured-card__emoji">
                      {animals[0].type?.toLowerCase() === 'dog' ? '🐕' : animals[0].type?.toLowerCase() === 'cat' ? '🐈' : '🐾'}
                    </span>
                  </div>
                  
                  <div className="featured-card__body">
                    <h2 className="featured-card__name">{animals[0].name}</h2>
                    <p className="featured-card__breed">{animals[0].breed}</p>
                    
                    <div className="featured-card__tags">
                      <span className="featured-card__tag" data-type="temperament">{animals[0].temperament || 'unknown'}</span>
                      <span className="featured-card__tag" data-type="age">{animals[0].age}y</span>
                      {animals[0].vaccinated ? (
                        <span className="featured-card__tag" data-type="vaccinated">💉 vaccinated</span>
                      ) : null}
                    </div>
                    
                    <button 
                      type="button" 
                      className="featured-card__btn"
                      onClick={() => setSelectedAnimal(animals[0])}
                    >
                      View {animals[0].name}'s Profile →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="animals-page__filters-wrapper">
          <div className="animals-page__content">
            <section className="animals-page__filters" aria-label="Animal filters">
          <select
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="">All types</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>

          <select
            value={filters.size}
            onChange={(e) => setFilters((f) => ({ ...f, size: e.target.value }))}
          >
            <option value="">All sizes</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>

          <select
            value={filters.temperament}
            onChange={(e) => setFilters((f) => ({ ...f, temperament: e.target.value }))}
          >
            <option value="">All temperaments</option>
            <option value="calm">Calm</option>
            <option value="friendly">Friendly</option>
            <option value="energetic">Energetic</option>
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
            <option value="">Vaccinated (all)</option>
            <option value="1">Vaccinated</option>
            <option value="0">Not vaccinated</option>
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
            <option value="0">Available</option>
            <option value="1">Adopted</option>
            <option value="">All</option>
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
            <option value="">All ages</option>
            <option value="young">Young (0-2)</option>
            <option value="adult">Adult (3-7)</option>
            <option value="senior">Senior (8+)</option>
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
              Reset
            </button>
          ) : null}
        </section>
          </div>
        </div>

        <div className="animals-page__grid-wrapper">
          <div className="animals-page__content">
                  {animals.length === 0 ? (
          <p className="animals-page__empty">No animals found. Try widening your filters.</p>
        ) : (
          <section className="animals-page__grid" aria-label="Animal cards">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} onAbout={(a) => setSelectedAnimal(a)}
              isFavorited={favoriteIds.includes(animal.id)}
              onFavorite={(id) =>{setFavoriteIds((prev) => [...prev, id]);
                }}
              onFavoriteRemove={(id) => {
                setFavoriteIds((prev) => prev.filter((favId) => favId !== id));}}
              adoptionStatus={adoptionStatusMap[animal.id] ?? null}
              onAdoptionRequest={handleAdoptionRequest}
              />
            ))}
          </section>
        )}
          </div>
        </div>
      </main>

      <AnimalModal key={selectedAnimal?.id} animal={selectedAnimal}
       onClose={() => setSelectedAnimal(null)}
       onAdopt={handleAdoptionRequest}
       adoptionStatus={selectedAnimal ? (adoptionStatusMap[selectedAnimal.id] ?? null) : null}/>
    </>
  );
}