import './App.css'
import { useState } from 'react';
import AnimalsPage from './pages/Animals/AnimalsPage';
import MatchPage from './pages/Match/MatchPage';

function App() {
  const [page, setPage] = useState<'animals' | 'match'>('animals');

  return (
    <>
      <nav style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '10px',
      }}>
        <button
          onClick={() => setPage('animals')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: page === 'animals' ? '#007bff' : '#e0e0e0',
            color: page === 'animals' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          All Animals
        </button>
        <button
          onClick={() => setPage('match')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: page === 'match' ? '#007bff' : '#e0e0e0',
            color: page === 'match' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Find Your Best Friend 🐾
        </button>
      </nav>
      {page === 'animals' ? <AnimalsPage /> : <MatchPage />}
    </>
  );
}

export default App
