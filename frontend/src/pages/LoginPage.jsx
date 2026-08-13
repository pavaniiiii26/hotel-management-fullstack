import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
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
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container" style={{ maxWidth: '460px', minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="editorial-header" style={{ marginBottom: '32px' }}>
        <h1>SIGN IN</h1>
        <p>Access your staff profile & restaurant management</p>
      </div>

      <div className="editorial-card" style={{ padding: '36px', background: 'var(--bg-cream)' }}>
        {error && (
          <div style={{ background: 'rgba(214, 164, 156, 0.2)', border: '1px solid var(--accent-rose)', color: '#8f3b33', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.92rem' }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#ffffff', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.92rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn-pill-solid"
            disabled={loading}
            style={{ width: '100%', padding: '14px', cursor: 'pointer' }}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          New team member? <Link to="/signup" style={{ color: 'var(--text-dark)', fontWeight: '600' }}>Create account</Link>
        </div>
      </div>
    </div>
  );
}
