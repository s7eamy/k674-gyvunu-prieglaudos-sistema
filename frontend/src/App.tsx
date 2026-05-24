import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimalsPage from './pages/Animals/AnimalsPage';
import MatchPage from './pages/Match/MatchPage';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import VolunteerPage from './pages/Volunteer/VolunteerRegistrationsPage';
import DonationPage from './pages/Donation/DonationPage';
import ProfilePage from './pages/Profile/ProfilePage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminPage from './pages/Admin/AdminPage';
import AdminAdoptionRequestsPage from './pages/Admin/AdminAdoptionRequestsPage';
import MerchandisePage from './pages/Merchandise/MerchandisePage';
import CartPage from './pages/Merchandise/CartPage';
import AddAnimalPage from './pages/Admin/AddAnimalPage';
import PostCreationPage from './pages/Admin/PostCreationPage';
import PostsPage from './pages/Posts/PostsPage';
import AdminFeaturePlaceholderPage from './pages/Admin/AdminFeaturePlaceholderPage';
import LeaderboardPage from './pages/Leaderboard/LeaderboardPage';
import HtmlLangSync from './components/common/HtmlLangSync';

function App() {
  return (
    <BrowserRouter>
      <HtmlLangSync />
      <Routes>
        <Route path="/" element={<AnimalsPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/volunteer-registrations" element={<AdminPage />} />
        <Route path="/admin/adoption-requests" element={<AdminAdoptionRequestsPage />} />
        <Route path="/admin/post-creation" element={<PostCreationPage />} />
        <Route path="/merchandise" element={<MerchandisePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/admin/add-animal" element={<AddAnimalPage />} />
        <Route path="/admin/merchandise" element={<AdminFeaturePlaceholderPage keyPrefix="merchandise" />} />
        <Route path="/admin/donations" element={<AdminFeaturePlaceholderPage keyPrefix="donations" />} />
        <Route path="/admin/users" element={<AdminFeaturePlaceholderPage keyPrefix="users" />} />
        <Route path="/admin/*" element={<AdminFeaturePlaceholderPage keyPrefix="notFound" />} />
        <Route path="/postcreation" element={<PostCreationPage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
