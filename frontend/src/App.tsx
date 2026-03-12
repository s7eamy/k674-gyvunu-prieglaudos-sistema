import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimalsPage from './pages/Animals/AnimalsPage';
import MatchPage from './pages/Match/MatchPage';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import VolunteerPage from './pages/Volunteer/VolunteerRegistrationsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnimalsPage />} />
        <Route path="/match" element={<MatchPage />} />
                <Route path="/volunteer" element={<VolunteerPage/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
