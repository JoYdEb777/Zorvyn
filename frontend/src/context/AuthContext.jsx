import { createContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('zorvyn_token');
    localStorage.removeItem('zorvyn_user');
  }, []);

  // Load stored auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('zorvyn_token');
    const storedUser = localStorage.getItem('zorvyn_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      API.get('/auth/me')
        .then((res) => {
          const freshUser = res.data.data.user;
          setUser(freshUser);
          localStorage.setItem('zorvyn_user', JSON.stringify(freshUser));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { user: userData, token: jwt } = res.data.data;
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('zorvyn_token', jwt);
    localStorage.setItem('zorvyn_user', JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    const { user: userData, token: jwt } = res.data.data;
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('zorvyn_token', jwt);
    localStorage.setItem('zorvyn_user', JSON.stringify(userData));
    return userData;
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAnalyst = user?.role === 'analyst';
  const isViewer = user?.role === 'viewer';
  const canViewRecords = isAdmin || isAnalyst;
  const canManageRecords = isAdmin;
  const canManageUsers = isAdmin;
  const canViewAnalytics = isAdmin || isAnalyst;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAnalyst,
        isViewer,
        canViewRecords,
        canManageRecords,
        canManageUsers,
        canViewAnalytics,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
