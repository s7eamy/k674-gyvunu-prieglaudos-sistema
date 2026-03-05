// Animals page — main page component for listing, creating, editing, and deleting animals
import { useState, useEffect } from 'react'
import { getAll, type AnimalFilters } from "../../services/animalService";
import type { Animal } from '../../types/Animal';


export default function AnimalsPage() {
        const [animals, setAnimals] = useState<Animal[]>([]);
        const [filters, setFilters] = useState<AnimalFilters>({
  type: "",
  size: "",
  temperament: "",
});

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await getAll({
  type: filters.type || undefined,
  size: filters.size || undefined,
  temperament: filters.temperament || undefined,
});
        setAnimals(data);
      } catch (error) {
        console.error("Fetch failed", error);
      }
    };

    fetchAnimals();
  }, [filters]); 

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
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
    onChange={(e) =>
      setFilters((f) => ({ ...f, temperament: e.target.value }))
    }
  >
    <option value="">All temperaments</option>
    <option value="calm">Calm</option>
    <option value="friendly">Friendly</option>
    <option value="energetic">Energetic</option>
  </select>

  <button onClick={() => setFilters({ type: "", size: "", temperament: "" })}>
    Reset
  </button>
</div>
        <p>
          {animals.map((animal) => (
            <span key={animal.id}> {animal.name} {animal.type} {animal.breed} {animal.size} {animal.age}
            {animal.vaccinated} {animal.temperament} {animal.description} {animal.adopted}
            {animal.created_at.toString()}<br></br> </span>
          ))}
        </p>
      </div>
    </>
  )
}