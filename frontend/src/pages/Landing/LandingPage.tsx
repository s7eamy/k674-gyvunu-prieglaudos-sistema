import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/layout/LanguageSwitcher';
import { getUserProfile } from '../../services/userService';
import './LandingPage.css';

const SUPPORT_CARDS = [
  {
    key: 'donate',
    to: '/donate',
    icon: '💝',
  },
  {
    key: 'merchandise',
    to: '/merchandise',
    icon: '🎽',
  },
  {
    key: 'volunteer',
    to: '/volunteer',
    icon: '🤝',
  },
] as const;

function LandingPage() {
  const { t } = useTranslation('landing');
  const [isAuthenticated] = useState<boolean>(() => Boolean(localStorage.getItem('access_token')));
  const [userName] = useState<string>(() => localStorage.getItem('user_name') || '');
  const [userAvatarFilename, setUserAvatarFilename] = useState<string>(() =>
    localStorage.getItem('user_avatar_filename') || ''
  );

  useEffect(() => {
    const handleAvatarUpdated = () => {
      setUserAvatarFilename(localStorage.getItem('user_avatar_filename') || '');
    };

    window.addEventListener('avatar-updated', handleAvatarUpdated);
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdated);
  }, []);

  useEffect(() => {
    const loadAvatar = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return;
      }

      try {
        const profile = await getUserProfile();
        const avatarName = profile.user.avatar_filename || '';
        setUserAvatarFilename(avatarName);
        localStorage.setItem('user_avatar_filename', avatarName);
      } catch {
        // Ignore avatar refresh failures on the public front page.
      }
    };

    void loadAvatar();
  }, [isAuthenticated]);

  const avatarInitial = userName.charAt(0).toUpperCase() || 'P';

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header__inner">
          <Link to="/" className="landing-header__brand" aria-label={t('aria.brand_home')}>
            <span className="landing-header__brand-icon" aria-hidden="true">
              🏠
            </span>
            <span className="landing-header__brand-text">{t('brand')}</span>
          </Link>

          <div className="landing-header__actions">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link to="/profile" className="landing-header__profile" title={t('auth.profileTitle')}>
                {userAvatarFilename ? (
                  <img
                    className="landing-header__profile-image"
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/auth/avatar/${userAvatarFilename}`}
                    alt={userName}
                  />
                ) : (
                  avatarInitial
                )}
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing-header__btn landing-header__btn--ghost">
                  {t('auth.login')}
                </Link>
                <Link to="/register" className="landing-header__btn landing-header__btn--primary">
                  {t('auth.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="landing-shell landing-shell--hero">
          <div className="landing-shell__inner">
            <div className="landing-page__hero" aria-labelledby="landing-hero-title">
              <div className="landing-page__hero-copy">
                <p className="landing-page__eyebrow">{t('hero.eyebrow')}</p>
                <h1 id="landing-hero-title">{t('hero.title')}</h1>
                <p className="landing-page__tagline">{t('hero.tagline')}</p>
              </div>

              <div className="landing-page__hero-cards" aria-label={t('hero.eyebrow')}>
                <Link to="/animals" className="landing-card landing-card--primary">
                  <span className="landing-card__icon" aria-hidden="true">
                    🐾
                  </span>
                  <span className="landing-card__label">{t('featureCards.adoptionLabel')}</span>
                  <h2>{t('featureCards.browseTitle')}</h2>
                  <p>{t('featureCards.browseDescription')}</p>
                  <span className="landing-card__action">{t('featureCards.browseAction')}</span>
                </Link>

                <Link to="/match" className="landing-card landing-card--secondary">
                  <span className="landing-card__icon" aria-hidden="true">
                    💛
                  </span>
                  <span className="landing-card__label">{t('featureCards.matchLabel')}</span>
                  <h2>{t('featureCards.matchTitle')}</h2>
                  <p>{t('featureCards.matchDescription')}</p>
                  <span className="landing-card__action">{t('featureCards.matchAction')}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-shell landing-shell--support">
          <div className="landing-shell__inner">
            <div className="landing-page__section">
              <div className="landing-page__section-heading">
                <p className="landing-page__eyebrow">{t('support.eyebrow')}</p>
                <h2>{t('support.title')}</h2>
              </div>

              <div className="landing-page__support-grid">
                {SUPPORT_CARDS.map((card) => (
                  <Link key={card.key} to={card.to} className="landing-support-card">
                    <span className="landing-support-card__icon" aria-hidden="true">
                      {card.icon}
                    </span>
                    <h3>{t(`supportCards.${card.key}Title`)}</h3>
                    <p>{t(`supportCards.${card.key}Description`)}</p>
                    <span className="landing-support-card__action">{t(`supportCards.${card.key}Action`)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-shell landing-shell--community">
          <div className="landing-shell__inner">
            <div className="landing-page__community">
              <div className="landing-page__community-copy">
                <p className="landing-page__eyebrow">{t('community.eyebrow')}</p>
                <h2>{t('community.title')}</h2>
                <p className="landing-page__community-text">{t('community.text')}</p>
              </div>

              <div className="landing-page__community-actions">
                <Link to="/posts" className="landing-page__cta landing-page__cta--secondary">
                  {t('community.postsAction')}
                </Link>
                <Link to="/leaderboard" className="landing-page__cta landing-page__cta--ghost">
                  {t('community.leaderboardAction')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;