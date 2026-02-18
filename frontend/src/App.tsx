import { useState, useEffect, useCallback } from 'react'
import './App.css'
import axios from "axios"
import { getAll } from './services/animalService';
import type { Animal } from './types/Animal'

function App() {

const [animals, setAnimals] = useState<Animal[]>([]);

  // We use useCallback to "memoize" the function
  // This tells React the function doesn't change on every render
  const loadAnimals = useCallback(async () => {
    try {
      const data = await getAll();
      setAnimals(data);
    } catch (error) {
      console.error("Fetch failed", error);
    }
  }, []); // Empty array means this function is created once

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]); // Now loadAnimals is a stable dependency

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          {animals.map((animal) => (
            <span key={animal.id}> {animal.name} {animal.type} {animal.breed} {animal.size} {animal.age} {animal.vaccinated} {animal.temperament} {animal.description} {animal.adopted} {animal.created_at.toString()}<br></br> </span>
          ))}
        </p>
      </div>
    </>
  )
}

export default App
