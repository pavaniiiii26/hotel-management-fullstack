import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EditorialNavbar() {
  const location = useLocation();
  const { token, user } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isManager = user?.role === 'manager' || user?.work === 'manager';

  return (
    <>
      <nav className="zesty-nav">
        <div className="zesty-nav-inner">
          <div className="zesty-nav-left">
            <button
              onClick={() => setShowContactModal(true)}
              className="zesty-nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              CONTACT
            </button>
          </div>

          <Link to="/" className="zesty-logo">
            zesty
          </Link>

          <div className="zesty-nav-right">
            <Link
              to="/menu"
              className={`zesty-nav-link ${isActive('/menu') ? 'active' : ''}`}
            >
              MENU
            </Link>
            <Link
              to="/staff"
              className={`zesty-nav-link ${isActive('/staff') ? 'active' : ''}`}
            >
              STAFF
            </Link>
            <Link
              to="/kitchen"
              className={`zesty-nav-link ${isActive('/kitchen') ? 'active' : ''}`}
            >
              KITCHEN
            </Link>
            {isManager && (
              <Link
                to="/menu/add"
                className={`zesty-nav-link ${isActive('/menu/add') ? 'active' : ''}`}
                style={{ color: 'var(--accent-gold)', fontWeight: '600' }}
              >
                + ADD ITEM
              </Link>
            )}
            {token ? (
              <Link
                to="/dashboard"
                className={`zesty-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                ACCOUNT
              </Link>
            ) : (
              <Link
                to="/login"
                className={`zesty-nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="contact-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowContactModal(false)}>
              &times;
            </button>
            <h2>Contact Us</h2>
            <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>
              We would love to welcome you.
            </p>
            <div style={{ textAlign: 'center', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              <p>📍 124 Culinary Boulevard, Suite 500</p>
              <p>📞 +91 9588655454</p>
              <p>✉️ reservations@zestyrestaurant.com</p>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Built by Pavani Patel
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
