import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import type { Animal } from './types/Animal'

function App() {
  const [animals, setAnimals] = useState<Animal[]>([])

  const fetchAPI = async() => {
    const response = await axios.get("http://localhost:8081/api/animals");
    console.log(response.data.animals)
    setAnimals(response.data.animals)
  }

  useEffect(() => {
    fetchAPI()
  },[])
  
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          {animals.map((animal) => (
            <span key={animal.id}> {animal.name} ({animal.species})<br></br> </span>
          ))}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
