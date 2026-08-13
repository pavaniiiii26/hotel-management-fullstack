import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    age: '',
    work: '',
    role: 'staff',
    mobile: '',
    salary: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        role: form.role === 'manager' ? 'manager' : 'staff',
        age: form.age ? Number(form.age) : undefined,
        salary: Number(form.salary),
      };
      await signup(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container" style={{ maxWidth: '560px' }}>
      <div className="editorial-header" style={{ marginBottom: '32px' }}>
        <h1>CREATE ACCOUNT</h1>
        <p>Register as a chef, waiter, or manager at Zesty</p>
      </div>

      <div className="editorial-card" style={{ padding: '36px', background: 'var(--bg-cream)' }}>
        {error && (
          <div style={{ background: 'rgba(214, 164, 156, 0.2)', border: '1px solid var(--accent-rose)', color: '#8f3b33', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Pavani Patel"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="pavanipatel"
                value={form.username}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="pavani@zesty.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Work Title
              </label>
              <select
                name="work"
                value={form.work}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.85rem' }}
              >
                <option value="">Select Work</option>
                <option value="chef">Chef</option>
                <option value="waiter">Waiter</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                System Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.85rem' }}
              >
                <option value="staff">Staff (Default)</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="25"
                value={form.age}
                onChange={handleChange}
                min={18}
                max={80}
                style={{ width: '100%', padding: '12px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="9876543210"
                value={form.mobile}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Salary ($/₹)
              </label>
              <input
                type="number"
                name="salary"
                placeholder="45000"
                value={form.salary}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-pill-solid"
            disabled={loading}
            style={{ width: '100%', padding: '14px', cursor: 'pointer' }}
          >
            {loading ? 'REGISTERING...' : 'REGISTER ACCOUNT'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--text-dark)', fontWeight: '600' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
