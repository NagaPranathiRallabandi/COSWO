import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // This endpoint should be created in your backend to verify a token
          // and return user data.
          const { data } = await apiClient.get('/auth/me'); 
          setUser(data);
        } catch (error) {
          console.error("Failed to load user", error);
          localStorage.removeItem('token');
        }
      } else {
        // Do NOT set a default test user. Only set user if token exists.
        setUser(null);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await apiClient.post('/users/login', { email, password });
    localStorage.setItem('token', data.token);
    const decoded = JSON.parse(atob(data.token.split('.')[1]));
    setUser(decoded.user);
    return decoded.user; // Return user info
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const authContextValue = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};