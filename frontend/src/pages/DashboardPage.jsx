import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [menuCount, setMenuCount] = useState(0);
  const [staffCounts, setStaffCounts] = useState({ chef: 0, waiter: 0, manager: 0 });

  useEffect(() => {
    // Fetch menu count
    api.get('/menu?limit=1').then((res) => {
      setMenuCount(res.data.pagination?.total || 0);
    }).catch(() => {});

    // Fetch staff counts for each role
    ['chef', 'waiter', 'manager'].forEach((role) => {
      api.get(`/person/${role}?limit=1`).then((res) => {
        setStaffCounts((prev) => ({
          ...prev,
          [role]: res.data.pagination?.total || 0,
        }));
      }).catch(() => {});
    });
  }, []);

  if (!user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const totalStaff = staffCounts.chef + staffCounts.waiter + staffCounts.manager;

  return (
    <div className="page-container">
      {/* Profile Card */}
      <div className="profile-card animate-in" id="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p className="profile-meta">
            @{user.username} &nbsp;·&nbsp; <span className="badge badge-role">{user.work}</span>
          </p>
          <p className="profile-meta" style={{ marginTop: '4px' }}>
            {user.email} &nbsp;·&nbsp; {user.mobile}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="page-header animate-in stagger-1">
        <h1>Dashboard</h1>
        <p>Overview of your hotel operations</p>
      </div>

      <div className="stats-row">
        <div className="stat-card animate-in stagger-2" id="stat-menu">
          <div className="stat-value">{menuCount}</div>
          <div className="stat-label">Menu Items</div>
        </div>
        <div className="stat-card animate-in stagger-3" id="stat-staff">
          <div className="stat-value">{totalStaff}</div>
          <div className="stat-label">Total Staff</div>
        </div>
        <div className="stat-card animate-in stagger-4" id="stat-chefs">
          <div className="stat-value">{staffCounts.chef}</div>
          <div className="stat-label">Chefs</div>
        </div>
        <div className="stat-card animate-in stagger-5" id="stat-waiters">
          <div className="stat-value">{staffCounts.waiter}</div>
          <div className="stat-label">Waiters</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="page-header animate-in stagger-5">
        <h2 style={{ fontSize: '1.3rem' }}>Quick Actions</h2>
      </div>

      <div className="card-grid animate-in stagger-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <Link to="/menu" className="glass-card" id="action-menu" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🍽️</div>
          <h4>Browse Menu</h4>
          <p style={{ fontSize: '0.85rem' }}>View all dishes & drinks</p>
        </Link>

        <Link to="/staff" className="glass-card" id="action-staff" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
          <h4>View Staff</h4>
          <p style={{ fontSize: '0.85rem' }}>See team by role</p>
        </Link>

        {user.work === 'manager' && (
          <Link to="/menu/add" className="glass-card" id="action-add-menu" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>➕</div>
            <h4>Add Menu Item</h4>
            <p style={{ fontSize: '0.85rem' }}>Create a new dish</p>
          </Link>
        )}
      </div>
    </div>
  );
}
