import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimalsPage from './pages/Animals/AnimalsPage';
import MatchPage from './pages/Match/MatchPage';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import VolunteerPage from './pages/Volunteer/VolunteerRegistrationsPage';
import DonationPage from './pages/Donation/DonationPage';
import AdminPage from './pages/Admin/AdminPage';
import MerchandisePage from './pages/Merchandise/MerchandisePage';
import AddAnimalPage from './pages/Admin/AddAnimalPage';
import PostCreationPage from './pages/Admin/PostCreationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnimalsPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/volunteer" element={<VolunteerPage/>} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/merchandise" element={<MerchandisePage />} />
        <Route path="/admin/add-animal" element={<AddAnimalPage />} />
        <Route path="/postcreation" element={<PostCreationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App