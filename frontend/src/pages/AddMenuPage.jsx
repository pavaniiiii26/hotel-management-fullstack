import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function AddMenuPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    taste: '',
    is_drink: false,
    ingredients: '',
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', Number(form.price));
      formData.append('taste', form.taste);
      formData.append('is_drink', form.is_drink);

      if (form.ingredients.trim()) {
        form.ingredients.split(',').forEach((ing) => {
          formData.append('ingredients[]', ing.trim());
        });
      }

      if (photo) {
        formData.append('photo', photo);
      }

      await api.post('/menu', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container" style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div className="editorial-header" style={{ marginBottom: '32px' }}>
        <h1>ADD MENU ITEM</h1>
        <p>Create & publish a new culinary dish or drink for the menu</p>
      </div>

      <div className="editorial-card" style={{ padding: '36px', background: 'var(--bg-cream)' }}>
        {error && (
          <div style={{ background: 'rgba(214, 164, 156, 0.2)', border: '1px solid var(--accent-rose)', color: '#8f3b33', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="add-menu-form">
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
              Item Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Truffle Mushroom Risotto"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Price ($/₹)
              </label>
              <input
                type="number"
                name="price"
                placeholder="28"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Taste Profile
              </label>
              <select
                name="taste"
                value={form.taste}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
              >
                <option value="">Select Taste</option>
                <option value="sweet">Sweet</option>
                <option value="salty">Salty</option>
                <option value="sour">Sour</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
              Ingredients (comma-separated)
            </label>
            <input
              type="text"
              name="ingredients"
              placeholder="wild mushroom, arborio rice, truffle oil, parmesan"
              value={form.ingredients}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
              Photo Upload (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="item-is-drink"
              name="is_drink"
              checked={form.is_drink}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--text-dark)' }}
            />
            <label htmlFor="item-is-drink" style={{ fontSize: '0.88rem', color: 'var(--text-dark)', cursor: 'pointer' }}>
              This item is a beverage / drink
            </label>
          </div>

          <button
            type="submit"
            className="btn-pill-solid"
            disabled={loading}
            style={{ width: '100%', padding: '14px', cursor: 'pointer' }}
          >
            {loading ? 'PUBLISHING...' : 'PUBLISH DISH TO MENU'}
          </button>
        </form>
      </div>
    </div>
  );
}
