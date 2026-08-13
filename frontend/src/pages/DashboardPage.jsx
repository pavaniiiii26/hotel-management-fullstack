import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuCount, setMenuCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    api.get('/menu?limit=1').then((res) => {
      setMenuCount(res.data.pagination?.total || 0);
    }).catch(() => {});

    api.get('/order').then((res) => {
      setOrderCount(res.data.length || 0);
    }).catch(() => {});
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
        Loading dashboard...
      </div>
    );
  }

  const getInitials = (name) =>
    name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : '?';

  return (
    <div className="section-container">
      {/* Profile Card */}
      <div className="editorial-card" style={{ padding: '40px', background: 'var(--bg-cream)', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--text-dark)',
            color: 'var(--bg-taupe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: '600'
          }}
        >
          {getInitials(user.name)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{user.name}</h2>
          <p style={{ fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: '600' }}>
            {user.work} &nbsp;·&nbsp; @{user.username}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {user.email} &nbsp;•&nbsp; {user.mobile}
          </p>
        </div>
        <button
          className="btn-pill-outline"
          onClick={() => { logout(); navigate('/login'); }}
        >
          LOGOUT
        </button>
      </div>

      {/* Quick Links */}
      <div className="editorial-header" style={{ marginBottom: '32px' }}>
        <h2>RESTAURANT MANAGEMENT</h2>
      </div>

      <div className="menu-grid">
        {(user?.role === 'manager' || user?.work === 'manager') && (
          <Link to="/menu/add" style={{ textDecoration: 'none' }}>
            <div className="editorial-card" style={{ padding: '32px', background: 'var(--text-dark)', color: 'var(--bg-cream)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: '#ffffff' }}>➕ Add Menu Item</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>Create & publish new dishes</p>
            </div>
          </Link>
        )}

        <Link to="/menu" style={{ textDecoration: 'none' }}>
          <div className="editorial-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Menu Directory</h3>
            <p style={{ fontSize: '0.9rem' }}>{menuCount} dishes active</p>
          </div>
        </Link>

        <Link to="/kitchen" style={{ textDecoration: 'none' }}>
          <div className="editorial-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Kitchen Queue</h3>
            <p style={{ fontSize: '0.9rem' }}>{orderCount} orders in queue</p>
          </div>
        </Link>

        <Link to="/staff" style={{ textDecoration: 'none' }}>
          <div className="editorial-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Staff Roster</h3>
            <p style={{ fontSize: '0.9rem' }}>View team by role</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
