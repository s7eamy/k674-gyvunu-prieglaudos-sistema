import './App.css'
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
import MerchandisePage from './pages/Merchandise/MerchandisePage';
import CartPage from './pages/Merchandise/CartPage';
import AddAnimalPage from './pages/Admin/AddAnimalPage';
import PostCreationPage from './pages/Admin/PostCreationPage';
import PostsPage from './pages/Posts/PostsPage';
import AdminFeaturePlaceholderPage from './pages/Admin/AdminFeaturePlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnimalsPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/volunteer" element={<VolunteerPage/>} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/volunteer-registrations" element={<AdminPage />} />
        <Route path="/admin/post-creation" element={<PostCreationPage />} />
        <Route path="/merchandise" element={<MerchandisePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin/add-animal" element={<AddAnimalPage />} />
        <Route
          path="/admin/merchandise"
          element={
            <AdminFeaturePlaceholderPage
              title="Merchandise management"
              description="This section will manage shelter merchandise listings and related updates."
              note="For now, merchandise shopping is available on the public merchandise page."
            />
          }
        />
        <Route
          path="/admin/donations"
          element={
            <AdminFeaturePlaceholderPage
              title="Donation management"
              description="This section will handle donation-related admin tools and support workflows."
              note="Donation collection for visitors remains available on the public donation page."
            />
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminFeaturePlaceholderPage
              title="User / admin management"
              description="This section will centralize user and admin access management tools."
              note="User management tools will be connected here when the admin workflow is ready."
            />
          }
        />
        <Route path="/postcreation" element={<PostCreationPage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App