import { useState, useEffect } from 'react';
import api from '../api/api';

const ROLES = ['chef', 'waiter', 'manager'];

export default function StaffPage() {
  const [activeRole, setActiveRole] = useState('chef');
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/person/${activeRole}?page=${page}&limit=12`)
      .then((res) => {
        setStaff(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(() => {
        setStaff([]);
      })
      .finally(() => setLoading(false));
  }, [activeRole, page]);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setPage(1);
  };

  const getInitials = (name) =>
    name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : '?';

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1>Our Team</h1>
        <p>Meet the people behind the magic</p>
      </div>

      {/* Role Filter */}
      <div className="filter-tabs animate-in stagger-1" id="staff-filters">
        {ROLES.map((role) => (
          <button
            key={role}
            className={`filter-tab ${activeRole === role ? 'active' : ''}`}
            onClick={() => handleRoleChange(role)}
            id={`filter-${role}`}
          >
            {role === 'chef' ? '👨‍🍳' : role === 'waiter' ? '🤵' : '💼'} {role.charAt(0).toUpperCase() + role.slice(1)}s
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : staff.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>No {activeRole}s found</h3>
          <p>There are no team members with this role.</p>
        </div>
      ) : (
        <>
          <div className="card-grid" id="staff-grid">
            {staff.map((person, i) => (
              <div
                key={person._id}
                className={`staff-card animate-in stagger-${(i % 6) + 1}`}
                id={`staff-card-${person._id}`}
              >
                <div className="staff-avatar">{getInitials(person.name)}</div>
                <div className="staff-info">
                  <h4>{person.name}</h4>
                  <p>@{person.username}</p>
                  <p>{person.email}</p>
                  <div style={{ marginTop: '4px' }}>
                    <span className="badge badge-role">{person.work}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '40px',
                alignItems: 'center',
              }}
              id="staff-pagination"
            >
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ← Prev
              </button>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
