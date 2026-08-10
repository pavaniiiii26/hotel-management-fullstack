import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch profile whenever token changes
  useEffect(() => {
    if (token) {
      api
        .get('/person/profile')
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await api.post('/person/login', { username, password });
    const newToken = res.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    return newToken;
  };

  const signup = async (data) => {
    const res = await api.post('/person/signup', data);
    const newToken = res.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    return newToken;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
