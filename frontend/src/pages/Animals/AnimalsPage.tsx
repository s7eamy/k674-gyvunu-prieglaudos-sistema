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
  vaccinated: undefined,
});

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await getAll({
  type: filters.type || undefined,
  size: filters.size || undefined,
  temperament: filters.temperament || undefined,
  vaccinated: filters.vaccinated,
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

  <select
  value={filters.vaccinated === undefined ? "" : String(filters.vaccinated)}
  onChange={(e) =>
    setFilters((f) => ({
      ...f,
      vaccinated: e.target.value === "" ? undefined : (Number(e.target.value) as 0 | 1),
    }))
  }
>
  <option value="">Vaccinated (all)</option>
  <option value="1">Vaccinated</option>
  <option value="0">Not vaccinated</option>
</select>


  <button
  onClick={() =>
    setFilters({
      type: "",
      size: "",
      temperament: "",
      vaccinated: undefined,
      adopted: undefined,
    })
  }
>
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