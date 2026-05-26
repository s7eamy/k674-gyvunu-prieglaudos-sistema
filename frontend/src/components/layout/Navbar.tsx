import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout } from '../../services/authService';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

function Navbar() {
  const { t } = useTranslation('navbar');
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedRole = localStorage.getItem('user_role') || '';
    const storedName = localStorage.getItem('user_name') || '';
    setIsAuthenticated(Boolean(token));
    setUserRole(storedRole);
    setUserName(storedName);
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Continue local logout even if backend call fails.
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      setIsAuthenticated(false);
      setUserRole('');
      navigate('/');
    }
  };

  const isAnimalsActive = location.pathname === '/';
  const isMatchActive = location.pathname === '/match';
  const isVolunteerActive = location.pathname === '/volunteer';
  const isDonateActive = location.pathname === '/donate';
  const isMerchandiseActive = location.pathname === '/merchandise';
  const isCartActive = location.pathname === '/cart';
  const isLeaderboardActive = location.pathname === '/leaderboard';
  const isPostsActive = location.pathname === '/posts';
  const isAdminDashboardActive = location.pathname.startsWith('/admin');
  const isAdmin = userRole === 'admin';

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label={t('aria.brand_home')}>
          <span className="navbar__brand-icon" aria-hidden="true">
            🏠
          </span>
          <span className="navbar__brand-text">{t('brand')}</span>
        </Link>

        <button
          type="button"
          className={`navbar__hamburger ${isMenuOpen ? 'is-open' : ''}`}
          aria-label={t('aria.toggle_menu')}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar__panel ${isMenuOpen ? 'is-open' : ''}`}>
          <nav className="navbar__links" aria-label={t('aria.primary_nav')}>
            {isAdmin ? (
              <>
                <Link
                  to="/admin"className={`navbar__dropdown-btn ${isAdminDashboardActive ? 'is-active' : ''}`}>
                  {t('links.adminDashboard')}
                </Link>

            <div className="navbar__dropdown">
            <button className="navbar__dropdown-btn">{t('links.browse')} </button>
              <div className="navbar__dropdown-content">
                <Link
                  to="/"className={`navbar__link ${isAnimalsActive ? 'is-active' : ''}`}>{t('links.animals')}
                </Link>
                <Link
                  to="/match"className={`navbar__link ${isMatchActive ? 'is-active' : ''}`}>{t('links.match')}
                </Link>
                <Link
                  to="/leaderboard"className={`navbar__link ${isLeaderboardActive ? 'is-active' : ''}`}>{t('links.leaderboard')}
                </Link>
                <Link
                  to="/posts"className={`navbar__link ${isPostsActive ? 'is-active' : ''}`}>{t('links.posts')}
                </Link>
              </div>
            </div>  

            <div className="navbar__dropdown">
            <button className="navbar__dropdown-btn">{t('links.help')}  </button>
              <div className="navbar__dropdown-content">
                <Link
                  to="/volunteer"className={`navbar__link ${isVolunteerActive ? 'is-active' : ''}`}>{t('links.volunteer')}
                </Link>
                <Link
                  to="/donate"className={`navbar__link ${isDonateActive ? 'is-active' : ''}`}>{t('links.donate')}
                </Link>
                <Link
                  to="/merchandise"className={`navbar__link ${isMerchandiseActive ? 'is-active' : ''}`}>{t('links.merchandise')}
                </Link>
                <Link
                  to="/cart"className={`navbar__link ${isCartActive ? 'is-active' : ''}`}>{t('links.cart')}
                </Link>
              </div>
            </div>
              </>
            ) : (
            <>
            <div className="navbar__dropdown">
            <button className="navbar__dropdown-btn">{t('links.browse')}  </button>
              <div className="navbar__dropdown-content">
                <Link
                  to="/"className={`navbar__link ${isAnimalsActive ? 'is-active' : ''}`}>{t('links.animals')}
                </Link>
                <Link
                  to="/match"className={`navbar__link ${isMatchActive ? 'is-active' : ''}`}>{t('links.match')}
                </Link>
                <Link
                  to="/leaderboard"className={`navbar__link ${isLeaderboardActive ? 'is-active' : ''}`}>{t('links.leaderboard')}
                </Link>
                <Link
                  to="/posts"className={`navbar__link ${isPostsActive ? 'is-active' : ''}`}>{t('links.posts')}
                </Link>
              </div>
            </div>  

            <div className="navbar__dropdown">
            <button className="navbar__dropdown-btn">{t('links.help')}  </button>
              <div className="navbar__dropdown-content">
                <Link
                  to="/volunteer"className={`navbar__link ${isVolunteerActive ? 'is-active' : ''}`}>{t('links.volunteer')}
                </Link>
                <Link
                  to="/donate"className={`navbar__link ${isDonateActive ? 'is-active' : ''}`}>{t('links.donate')}
                </Link>
                <Link
                  to="/merchandise"className={`navbar__link ${isMerchandiseActive ? 'is-active' : ''}`}>{t('links.merchandise')}
                </Link>
                <Link
                  to="/cart"className={`navbar__link ${isCartActive ? 'is-active' : ''}`}>{t('links.cart')}
                </Link>
              </div>
            </div> 
            </>
            )}
          </nav>

          <div className="navbar__auth" aria-label={t('aria.authentication')}>
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                <button type="button" className="navbar__btn navbar__btn--ghost" onClick={handleLogout}>
                  {t('auth.logout')}
                </button>
                <Link to="/profile" className="navbar__profile-circle" title={t('auth.profileTitle')}>
                  {userName.charAt(0).toUpperCase()}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar__btn navbar__btn--ghost">
                  {t('auth.login')}
                </Link>
                <Link to="/register" className="navbar__btn navbar__btn--primary">
                  {t('auth.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
