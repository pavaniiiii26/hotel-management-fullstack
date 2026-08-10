import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" id="nav-brand">
          🏨 <span>HotelApp</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/menu"
            className={`navbar-link ${isActive('/menu') ? 'active' : ''}`}
            id="nav-menu"
          >
            Menu
          </Link>
          <Link
            to="/staff"
            className={`navbar-link ${isActive('/staff') ? 'active' : ''}`}
            id="nav-staff"
          >
            Staff
          </Link>

          {token ? (
            <>
              <Link
                to="/dashboard"
                className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                id="nav-dashboard"
              >
                Dashboard
              </Link>
              {user?.work === 'manager' && (
                <Link
                  to="/menu/add"
                  className={`navbar-link ${isActive('/menu/add') ? 'active' : ''}`}
                  id="nav-add-menu"
                >
                  + Add Item
                </Link>
              )}
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleLogout}
                id="nav-logout"
                style={{ marginLeft: '8px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                id="nav-login"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-sm btn-primary"
                id="nav-signup"
                style={{ marginLeft: '8px' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
