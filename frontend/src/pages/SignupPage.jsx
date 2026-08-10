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
    <div className="auth-page">
      <div className="auth-card animate-in" style={{ maxWidth: '520px' }}>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join the team and get started</p>

        {error && (
          <div className="alert alert-error" id="signup-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-username">Username</label>
              <input
                type="text"
                id="signup-username"
                name="username"
                className="form-input"
                placeholder="johndoe"
                value={form.username}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              type="email"
              id="signup-email"
              name="email"
              className="form-input"
              placeholder="john@hotel.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              name="password"
              className="form-input"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="work">Role</label>
              <select
                id="work"
                name="work"
                className="form-input"
                value={form.work}
                onChange={handleChange}
                required
              >
                <option value="">Select role</option>
                <option value="chef">Chef</option>
                <option value="waiter">Waiter</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-input"
                placeholder="25"
                value={form.age}
                onChange={handleChange}
                min={18}
                max={80}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mobile">Mobile (10 digits)</label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                className="form-input"
                placeholder="9876543210"
                value={form.mobile}
                onChange={handleChange}
                required
                pattern="\d{10}"
              />
            </div>
            <div className="form-group">
              <label htmlFor="salary">Salary (₹)</label>
              <input
                type="number"
                id="salary"
                name="salary"
                className="form-input"
                placeholder="30000"
                value={form.salary}
                onChange={handleChange}
                required
                min={0}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (optional)</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              placeholder="123 Main St, City"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="signup-submit"
            style={{ width: '100%' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
