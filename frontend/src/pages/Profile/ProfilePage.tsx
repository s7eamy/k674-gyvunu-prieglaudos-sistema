import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import DonorLevelCard from '../../components/common/DonorLevelCard';
import VolunteerLevelCard from '../../components/common/VolunteerLevelCard';
import AnimalCard from '../../components/common/AnimalCard';
import AnimalModal from '../../components/common/AnimalModal';
import { getFavoriteAnimals } from '../../services/animalService';
import { getUserAdoptionRequests } from '../../services/adoptionRequestService';
import type {Animal} from '../../types/Animal';
import type { AdoptionRequest } from '../../types/AdoptionRequest';
import { getUserProfile, type UserProfile } from '../../services/userService';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteAnimals, setFavoriteAnimals] = useState<Animal[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch {
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchFavorites = async () => {
    try {
      const favorites = await getFavoriteAnimals();
      setFavoriteAnimals(favorites);
    } catch (err) {
      console.error(err);
    }
  };
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const requests = await getUserAdoptionRequests();
        setAdoptionRequests(requests);
      } catch {
        // Not logged in or error
      }
    };
    fetchAdoptionRequests();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="profile-page__loading">Loading profile...</div>
        </main>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="profile-page__error">{error || 'Unable to load profile'}</div>
        </main>
      </>
    );
  }

  const registeredDate = profile.user.created_at 
    ? new Date(profile.user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <>
      <Navbar />
      <main className="profile-page">
        <div className="profile-page__container">
          <header className="profile-page__header">
            <div className="profile-page__avatar">
              {profile.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-page__header-content">
              <h1>{profile.user.name}</h1>
              <p className="profile-page__email">{profile.user.email}</p>
              <p className="profile-page__registered">
                Registered on {registeredDate}
              </p>
            </div>
          </header>

          <section className="profile-page__levels">
            <div className="profile-page__level-card">
              <h2>💝 Donation Level</h2>
              <DonorLevelCard donorLevel={profile.donor_level} />
            </div>

            <div className="profile-page__level-card">
              <h2>📄 Volunteer Level</h2>
              <VolunteerLevelCard volunteerLevel={profile.volunteer_level} />
            </div>
          </section>

          <section className="profile-page__adoption-requests">
            <header className="animals-page__header">
              <h1>Adoption Requests</h1>
              <p>{adoptionRequests.length} request{adoptionRequests.length !== 1 ? 's' : ''}</p>
            </header>

            {adoptionRequests.length === 0 ? (
              <p className="animals-page__empty">No adoption requests yet. Browse animals and click "Adopt Me" to get started.</p>
            ) : (
              <div className="profile-page__adoption-grid">
                {adoptionRequests.map((req) => (
                  <div key={req.id} className="profile-page__adoption-card">
                    <div className="profile-page__adoption-card-header">
                      <span className="profile-page__adoption-animal-name">{req.animal_name}</span>
                      <span className={`profile-page__adoption-status profile-page__adoption-status--${req.status}`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="profile-page__adoption-card-details">
                      <span>Type: {req.animal_type}</span>
                      <span>Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <header className="animals-page__header">
          <h1>Favorite animals</h1>
          <p>{favoriteAnimals.length} animals are favorited</p>
        </header>

        {favoriteAnimals.length === 0 ? (
          <p className="animals-page__empty"> Add an animal to favorites to see them here.</p>
        ) : (
          <section className="animals-page__grid" aria-label="Animal cards">
            {favoriteAnimals.map((animal) => {
              const adoptionStatus = adoptionRequests
                .filter(r => r.animal_id === animal.id && (r.status === 'pending' || r.status === 'approved'))
                .map(r => r.status as 'pending' | 'approved')[0] ?? null;
              return (
                <AnimalCard key={animal.id} animal={animal} onAbout={(a) => setSelectedAnimal(a)}
                isFavorited={favoriteAnimals.includes(animal)}
                onFavorite={() =>{setFavoriteAnimals((prev) => [...prev, animal]);}}
                onFavoriteRemove={() => {setFavoriteAnimals((prev) => prev.filter((favId) => favId !== animal));}}
                adoptionStatus={adoptionStatus}
                />
              );
            })}
          </section>
        )}
        </div>
      </main>
       <AnimalModal key={selectedAnimal?.id} animal={selectedAnimal}
       onClose={() => setSelectedAnimal(null)}/>
    </>
  );
}

export default ProfilePage;
