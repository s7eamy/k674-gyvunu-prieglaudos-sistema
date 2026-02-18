// Animals page — main page component for listing, creating, editing, and deleting animals
import { useState, useEffect } from 'react'
import { getAll } from '../../services/animalService';
import type { Animal } from '../../types/Animal';


export default function AnimalsPage() {
        const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await getAll();
        setAnimals(data);
      } catch (error) {
        console.error("Fetch failed", error);
      }
    };

    fetchAnimals();
  }, []); 

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
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