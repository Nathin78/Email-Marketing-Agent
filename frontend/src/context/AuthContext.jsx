import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  const login = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({ name: authData.name, email: authData.email, role: authData.role }));
    setToken(authData.token);
    setUser({ name: authData.name, email: authData.email, role: authData.role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
