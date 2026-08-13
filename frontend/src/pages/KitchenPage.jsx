import { useState, useEffect } from 'react';
import api from '../api/api';

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/order');
      setOrders(res.data);
    } catch {
      // Fallback if empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 3 seconds for new orders
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkDone = async (orderId) => {
    try {
      await api.put(`/order/${orderId}/status`, { status: 'completed' });
      // Optimistic update
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: 'completed' } : ord))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredOrders = orders.filter((ord) =>
    activeTab === 'pending' ? ord.status !== 'completed' : ord.status === 'completed'
  );

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="section-container">
      <div className="editorial-header">
        <h1>KITCHEN QUEUE</h1>
        <p>Live order updates for executive chef team.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
        <button
          className={`btn-pill-outline ${activeTab === 'pending' ? 'btn-pill-solid' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ACTIVE ORDERS ({orders.filter((o) => o.status !== 'completed').length})
        </button>
        <button
          className={`btn-pill-outline ${activeTab === 'completed' ? 'btn-pill-solid' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          COMPLETED ({orders.filter((o) => o.status === 'completed').length})
        </button>
      </div>

      {/* Order List */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
          Loading kitchen orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍽️</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-dark)' }}>
            No {activeTab} orders
          </h3>
          <p>New customer orders from the menu will appear here automatically in real time.</p>
        </div>
      ) : (
        <div className="kitchen-queue">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-row">
              {order.photo ? (
                <img src={order.photo} alt={order.itemName} className="order-photo" />
              ) : (
                <div className="order-photo">🍳</div>
              )}

              <div className="order-info">
                <h3>{order.itemName}</h3>
                <div className="order-meta">
                  <span>Table #{order.tableNumber || 1}</span>
                  <span>•</span>
                  <span>Received at {formatTime(order.createdAt)}</span>
                </div>
              </div>

              <div>
                {order.status === 'completed' ? (
                  <span className="kitchen-badge badge-completed">✓ Completed</span>
                ) : (
                  <button
                    className="btn-pill-outline"
                    onClick={() => handleMarkDone(order._id)}
                  >
                    MARK AS DONE
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
