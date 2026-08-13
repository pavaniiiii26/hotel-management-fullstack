import { useState, useEffect } from 'react';
import api from '../api/api';

const ROLES = ['chef', 'waiter', 'manager'];

export default function StaffEditorialPage() {
  const [activeRole, setActiveRole] = useState('chef');
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/person/${activeRole}?page=1&limit=20`)
      .then((res) => {
        setStaff(res.data?.data || []);
      })
      .catch(() => {
        setStaff([]);
      })
      .finally(() => setLoading(false));
  }, [activeRole]);

  const getInitials = (name) =>
    name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : '?';

  return (
    <div className="section-container">
      <div className="editorial-header">
        <h1>OUR TEAM</h1>
        <p>The dedicated chefs, waiters, and managers behind Zesty.</p>
      </div>

      {/* Role Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
        {ROLES.map((role) => (
          <button
            key={role}
            className={`btn-pill-outline ${activeRole === role ? 'btn-pill-solid' : ''}`}
            onClick={() => setActiveRole(role)}
          >
            {role.toUpperCase()}S
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading team members...
        </div>
      ) : staff.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👤</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-dark)' }}>
            No {activeRole}s found
          </h3>
          <p>No staff accounts registered under this role yet.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {staff.map((person) => (
            <div key={person._id} className="editorial-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'var(--text-dark)',
                  color: 'var(--bg-taupe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: '600',
                  margin: '0 auto 20px'
                }}
              >
                {getInitials(person.name)}
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{person.name}</h3>
              <div
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  marginBottom: '16px',
                  fontWeight: '600'
                }}
              >
                {person.work}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <p>@{person.username}</p>
                <p>{person.email}</p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>📞 {person.mobile}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
