import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import DonorLevelCard from '../../components/common/DonorLevelCard';
import VolunteerLevelCard from '../../components/common/VolunteerLevelCard';
import AnimalCard from '../../components/common/AnimalCard';
import AnimalModal from '../../components/common/AnimalModal';
import VolunteerRegistrationCard from '../../components/common/VolunteerRegistrationCard';
import VolunteerRegistrationModal from '../../components/common/VolunteerRegistrationModal';
import SubscribeModal from '../../components/common/SubscribeModal';
import { getFavoriteAnimals } from '../../services/animalService';
import { getUserAdoptionRequests } from '../../services/adoptionRequestService';
import { getUserVolunteerRegistrations } from '../../services/volunteerRegistrationService';
import { deleteSubscription, getMySubscriptions, type Subscription } from '../../services/subscriptionService';
import type { Animal } from '../../types/Animal';
import type { AdoptionRequest } from '../../types/AdoptionRequest';
import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import { getUserProfile, uploadAvatar, deleteAvatar, type UserProfile } from '../../services/userService';
import { useEnumLabel } from '../../i18n/useEnumLabel';
import { useFormatters } from '../../i18n/formatters';
import './ProfilePage.css';

function ProfilePage() {
  const { t } = useTranslation(['profile', 'common']);
  const enumLabel = useEnumLabel();
  const { formatDate } = useFormatters();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteAnimals, setFavoriteAnimals] = useState<Animal[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [volunteerRegistrations, setVolunteerRegistrations] = useState<VolunteerRegistration[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedVolunteerRegistration, setSelectedVolunteerRegistration] = useState<VolunteerRegistration | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
        localStorage.setItem('user_avatar_filename', data.user.avatar_filename || '');
        window.dispatchEvent(new Event('avatar-updated'));
      } catch {
        setError(t('error'));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, [navigate, t]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await getMySubscriptions();
        const first = response.subscriptions?.[0] || null;
        setSubscription(first || null);
      } catch {
        // ignore if not logged in or no subscription
      }
    };
    fetchSubscription();
  }, []);

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

  useEffect(() => {
    const fetchVolunteerRegistrations = async () => {
      try {
        const registrations = await getUserVolunteerRegistrations();
        setVolunteerRegistrations(registrations);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVolunteerRegistrations();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="profile-page__loading">{t('loading')}</div>
        </main>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="profile-page__error">{error || t('errorGeneric')}</div>
        </main>
      </>
    );
  }

  const registeredDate = profile.user.created_at
    ? formatDate(profile.user.created_at, { year: 'numeric', month: 'long', day: 'numeric' })
    : t('labels.unknown', { ns: 'common', defaultValue: 'Unknown' });

  const parseList = (value?: string | null) =>
    value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];

  const handleUnsubscribe = async () => {
    if (!subscription) return;
    try {
      await deleteSubscription(subscription.id);
      setSubscription(null);
      setIsSubscribeOpen(false);
    } catch {
      // ignore unsubscribe errors for now
    }
  };

  return (
    <>
      <Navbar />
      <main className="profile-page">
        <div className="profile-page__container">
          <header className="profile-page__header">
            <div className="profile-page__avatar">
              {profile.user.avatar_filename ? (
                <img
                  className="profile-page__avatar-img"
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/avatar/${profile.user.avatar_filename}`}
                  alt={profile.user.name}
                />
              ) : (
                profile.user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="profile-page__header-content">
              <h1>{profile.user.name}</h1>
              <p className="profile-page__email">{profile.user.email}</p>
              <p className="profile-page__registered">{t('registeredOn', { date: registeredDate })}</p>
            </div>
            <div className="profile-page__header-actions">
              <span className="profile-page__subscription-status">
                {subscription ? t('subscription.subscribed') : t('subscription.notSubscribed')}
              </span>
              <button
                type="button"
                className="navbar__btn navbar__btn--ghost"
                onClick={() => setIsSubscribeOpen(true)}
              >
                {t('subscription.manage')}
              </button>
              <div className="profile-page__avatar-actions">
                <label className="navbar__btn navbar__btn--ghost" htmlFor="avatar-upload">
                  {isUploading ? t('labels.uploading', { ns: 'common' }) : t('upload')}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploading(true);
                    try {
                      const res = await uploadAvatar(file);
                      setProfile((prev) => prev ? { ...prev, user: { ...prev.user, avatar_filename: res.avatar_filename } } : prev);
                      localStorage.setItem('user_avatar_filename', res.avatar_filename);
                      window.dispatchEvent(new Event('avatar-updated'));
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                />
                {profile.user.avatar_filename && (
                  <button
                    type="button"
                    className="navbar__btn navbar__btn--ghost"
                    onClick={async () => {
                      try {
                        await deleteAvatar();
                        setProfile((prev) => prev ? { ...prev, user: { ...prev.user, avatar_filename: null } } : prev);                        localStorage.removeItem('user_avatar_filename');
                        window.dispatchEvent(new Event('avatar-updated'));                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    {t('remove')}
                  </button>
                )}
              </div>
            </div>
          </header>

          <section className="profile-page__levels">
            <div className="profile-page__level-card">
              <h2>{t('levels.donor')}</h2>
              <DonorLevelCard donorLevel={profile.donor_level} />
            </div>

            <div className="profile-page__level-card">
              <h2>{t('levels.volunteer')}</h2>
              <VolunteerLevelCard volunteerLevel={profile.volunteer_level} />
            </div>
          </section>

          <section className="profile-page__adoption-requests">
            <header className="profile-page__animal-header">
              <h1>{t('adoption.title')}</h1>
              <p>{t('adoption.count', { count: adoptionRequests.length })}</p>
            </header>

            {adoptionRequests.length === 0 ? (
              <p className="animals-page__empty">{t('adoption.empty')}</p>
            ) : (
              <div className="profile-page__adoption-grid">
                {adoptionRequests.map((req) => (
                  <div key={req.id} className="profile-page__adoption-card">
                    <div className="profile-page__adoption-card-header">
                      <span className="profile-page__adoption-animal-name">{req.animal_name}</span>
                      <span className={`profile-page__adoption-status profile-page__adoption-status--${req.status}`}>
                        {enumLabel('adoption_status', req.status)}
                      </span>
                    </div>
                    <div className="profile-page__adoption-card-details">
                      <span>{t('adoption.typeLabel', { type: enumLabel('animal_type', req.animal_type) })}</span>
                      <span>{t('adoption.submittedLabel', { date: formatDate(req.created_at) })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <header className="profile-page__animal-header">
            <h1>{t('favorites.title')}</h1>
            <p>{t('favorites.count', { count: favoriteAnimals.length })}</p>
          </header>

          {favoriteAnimals.length === 0 ? (
            <p className="animals-page__empty">{t('favorites.empty')}</p>
          ) : (
            <section className="animals-page__grid" aria-label={t('favorites.ariaGrid')}>
              {favoriteAnimals.map((animal) => {
                const adoptionStatus = adoptionRequests
                  .filter((r) => r.animal_id === animal.id && (r.status === 'pending' || r.status === 'approved'))
                  .map((r) => r.status as 'pending' | 'approved')[0] ?? null;
                return (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onAbout={(a) => setSelectedAnimal(a)}
                    isFavorited={favoriteAnimals.includes(animal)}
                    onFavorite={() => setFavoriteAnimals((prev) => [...prev, animal])}
                    onFavoriteRemove={() => setFavoriteAnimals((prev) => prev.filter((favId) => favId !== animal))}
                    adoptionStatus={adoptionStatus}
                  />
                );
              })}
            </section>
          )}

          <header className="profile-page__animal-header">
            <h1>{t('volunteering.title')}</h1>
            <p>{t('volunteering.count', { count: volunteerRegistrations.length })}</p>
          </header>

          {volunteerRegistrations.length === 0 ? (
            <p className="animals-page__empty">{t('volunteering.empty')}</p>
          ) : (
            <div className="profile-page__adoption-grid">
              {volunteerRegistrations.map((volunteerRegistration) => (
                <VolunteerRegistrationCard
                  key={volunteerRegistration.id}
                  volunteerRegistration={volunteerRegistration}
                  onAbout={(v) => setSelectedVolunteerRegistration(v)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimalModal key={selectedAnimal?.id} animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
      <VolunteerRegistrationModal
        key={selectedVolunteerRegistration?.id}
        volunteerRegistration={selectedVolunteerRegistration}
        onClose={() => setSelectedVolunteerRegistration(null)}
      />
      {isSubscribeOpen && (
        <SubscribeModal
          initial={{
            animalType: subscription?.animal_type || '',
            sizes: parseList(subscription?.size),
            temperaments: parseList(subscription?.temperament),
          }}
          onClose={() => setIsSubscribeOpen(false)}
          onUnsubscribe={subscription ? handleUnsubscribe : undefined}
        />
      )}
    </>
  );
}

export default ProfilePage;
