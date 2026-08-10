import { useState, useEffect } from 'react';
import api from '../api/api';
import MenuCard from '../components/MenuCard';

const TASTES = ['all', 'sweet', 'salty', 'sour'];

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);

    const fetchItems = async () => {
      try {
        let res;
        if (activeFilter === 'all') {
          res = await api.get(`/menu?page=${page}&limit=12`);
          setItems(res.data.data);
          setPagination(res.data.pagination);
        } else {
          res = await api.get(`/menu/${activeFilter}`);
          setItems(res.data);
          setPagination(null);
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeFilter, page]);

  const handleFilterChange = (taste) => {
    setActiveFilter(taste);
    setPage(1);
  };

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1>Our Menu</h1>
        <p>Explore our delicious dishes and refreshing drinks</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs animate-in stagger-1" id="menu-filters">
        {TASTES.map((taste) => (
          <button
            key={taste}
            className={`filter-tab ${activeFilter === taste ? 'active' : ''}`}
            onClick={() => handleFilterChange(taste)}
            id={`filter-${taste}`}
          >
            {taste === 'all' ? '🍴 All' : taste === 'sweet' ? '🍰 Sweet' : taste === 'salty' ? '🧂 Salty' : '🍋 Sour'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No items found</h3>
          <p>There are no menu items to display.</p>
        </div>
      ) : (
        <>
          <div className="card-grid" id="menu-grid">
            {items.map((item, i) => (
              <MenuCard key={item._id} item={item} index={i} />
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
              id="menu-pagination"
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
