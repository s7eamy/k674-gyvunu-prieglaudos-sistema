import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimalsPage from './pages/Animals/AnimalsPage';
import MatchPage from './pages/Match/MatchPage';
import RegisterPage from './pages/Auth/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnimalsPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
