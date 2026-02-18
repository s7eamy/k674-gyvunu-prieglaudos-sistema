import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios"
import type { Animal } from './types/Animal'

function App() {
  const [animals, setAnimals] = useState<Animal[]>([])

  const fetchAPI = async() => {
    const response = await axios.get("http://localhost:8081/api/animals");
    console.log(response.data)
    setAnimals(response.data)
  }

  useEffect(() => {
    fetchAPI()
  },[])
  
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
