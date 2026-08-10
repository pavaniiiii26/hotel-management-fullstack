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
    <div className="page-container">
      <div className="page-header animate-in">
        <h1>Add Menu Item</h1>
        <p>Create a new dish or drink for the menu</p>
      </div>

      <div className="glass-card animate-in stagger-1" style={{ maxWidth: '600px' }}>
        {error && (
          <div className="alert alert-error" id="add-menu-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="add-menu-form">
          <div className="form-group">
            <label htmlFor="item-name">Item Name</label>
            <input
              type="text"
              id="item-name"
              name="name"
              className="form-input"
              placeholder="e.g. Paneer Tikka"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="item-price">Price (₹)</label>
              <input
                type="number"
                id="item-price"
                name="price"
                className="form-input"
                placeholder="250"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
              />
            </div>
            <div className="form-group">
              <label htmlFor="item-taste">Taste</label>
              <select
                id="item-taste"
                name="taste"
                className="form-input"
                value={form.taste}
                onChange={handleChange}
                required
              >
                <option value="">Select taste</option>
                <option value="sweet">Sweet</option>
                <option value="salty">Salty</option>
                <option value="sour">Sour</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="item-ingredients">Ingredients (comma-separated)</label>
            <input
              type="text"
              id="item-ingredients"
              name="ingredients"
              className="form-input"
              placeholder="paneer, spices, onion, capsicum"
              value={form.ingredients}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="item-photo">Photo</label>
            <input
              type="file"
              id="item-photo"
              className="form-input"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              style={{ padding: '10px' }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="item-is-drink"
              name="is_drink"
              checked={form.is_drink}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
            <label htmlFor="item-is-drink" style={{ margin: 0, textTransform: 'none', fontSize: '0.95rem' }}>
              This is a drink
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="add-menu-submit"
            style={{ width: '100%' }}
          >
            {loading ? 'Adding...' : '🍽️ Add to Menu'}
          </button>
        </form>
      </div>
    </div>
  );
}
