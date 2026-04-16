// Animals page — main page component for listing, creating, editing, and deleting animals
import { useState, useEffect } from 'react';
import { getAll, type AnimalFilters } from '../../services/animalService';
import type { Animal } from '../../types/Animal';
import Navbar from '../../components/layout/Navbar';
import AnimalCard from '../../components/common/AnimalCard';
import AnimalModal from '../../components/common/AnimalModal';
import './AnimalsPage.css';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [filters, setFilters] = useState<AnimalFilters>({
    type: '',
    size: '',
    temperament: '',
    vaccinated: undefined,
    ageMin: undefined,
    ageMax: undefined,
  });

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await getAll({
          type: filters.type || undefined,
          size: filters.size || undefined,
          temperament: filters.temperament || undefined,
          vaccinated: filters.vaccinated,
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
    filters.ageMin !== undefined ||
    filters.ageMax !== undefined;

  return (
    <>
      <Navbar />

      <main className="animals-page">
        <header className="animals-page__header">
          <h1>Find Your Friend</h1>
          <p>{animals.length} animals looking for a home</p>
        </header>

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
                  ageMin: undefined,
                  ageMax: undefined,
                })
              }
            >
              Reset
            </button>
          ) : null}
        </section>

        {animals.length === 0 ? (
          <p className="animals-page__empty">No animals found. Try widening your filters.</p>
        ) : (
          <section className="animals-page__grid" aria-label="Animal cards">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} onAbout={(a) => setSelectedAnimal(a)} />
            ))}
          </section>
        )}
      </main>

      <AnimalModal key={selectedAnimal?.id} animal={selectedAnimal}
       onClose={() => setSelectedAnimal(null)}/>
    </>
  );
}