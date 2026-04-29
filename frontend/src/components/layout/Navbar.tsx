import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedRole = localStorage.getItem('user_role') || '';
    setIsAuthenticated(Boolean(token));
    setUserRole(storedRole);
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
  const isAdminDashboardActive = location.pathname === '/admin';
  const isAdminAddAnimalActive = location.pathname === '/admin/add-animal';
  const isAdmin = userRole === 'admin';
  
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Go to home page">
          <span className="navbar__brand-icon" aria-hidden="true">
            🏠
          </span>
          <span className="navbar__brand-text">PawFinder</span>
        </Link>

        <button
          type="button"
          className={`navbar__hamburger ${isMenuOpen ? 'is-open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar__panel ${isMenuOpen ? 'is-open' : ''}`}>
          <nav className="navbar__links" aria-label="Primary navigation">
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`navbar__link ${isAdminDashboardActive ? 'is-active' : ''}`}
                >
                  🛡 Admin Dashboard
                </Link>
                <Link
                  to="/admin/add-animal"
                  className={`navbar__link ${isAdminAddAnimalActive ? 'is-active' : ''}`}
                >
                  ➕ Add Animal
                </Link>
                <Link
                  to="/"
                  className={`navbar__link ${isAnimalsActive ? 'is-active' : ''}`}
                >
                  🐾 Public Animals
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`navbar__link ${isAnimalsActive ? 'is-active' : ''}`}
                >
                  🐾 Animals
                </Link>
                <Link
                  to="/match"
                  className={`navbar__link ${isMatchActive ? 'is-active' : ''}`}
                >
                  💛 Find My Match
                </Link>
                <Link
                  to="/volunteer"
                  className={`navbar__link ${isVolunteerActive ? 'is-active' : ''}`}
                >
                  📄 Volunteer
                </Link>
                <Link
                  to="/donate"
                  className={`navbar__link ${isDonateActive ? 'is-active' : ''}`}
                >
                  💝 Donations
                </Link>
                <Link
                  to="/merchandise"
                  className={`navbar__link ${isMerchandiseActive ? 'is-active' : ''}`}
                >
                  🎽 Merchandise
                </Link>
                <Link
                  to="/cart"
                  className={`navbar__link ${isCartActive ? 'is-active' : ''}`}
                >
                  🛒 Cart
                </Link>
              </>
            )}
          </nav>

          <div className="navbar__auth" aria-label="Authentication">
            {isAuthenticated ? (
              <button type="button" className="navbar__btn navbar__btn--ghost" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="navbar__btn navbar__btn--ghost">
                  Login
                </Link>
                <Link to="/register" className="navbar__btn navbar__btn--primary">
                  Register
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
