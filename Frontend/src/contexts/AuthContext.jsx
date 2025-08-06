import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = React.createContext(undefined);
const API_BASE_URL = 'http://localhost:8000/api'; // Your backend URL

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      // Now that the 'user' object from localStorage is complete, this is safe.
      if (savedToken && savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        username,
        password,
      });

      // --- MODIFICATION HERE ---
      // The response now contains a 'user' object.
      const { token, user } = response.data;

      // Store the token and the full user object
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user); // Set the full user object in state

    } catch (err) {
      setError('Invalid username or password');
      logout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => { // Assuming you pass the whole formData object
    setLoading(true);
    setError(null);
    try {
      // Use the formData directly for the POST request
      const response = await axios.post(`${API_BASE_URL}/register/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // --- MODIFICATION HERE ---
      // The register response also contains a 'user' object now.
      const { token, user } = response.data;

      // Store the token and the full user object
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Note: 'location' is now part of the 'user' object, so we don't need a separate state for it.
  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      login,
      register, // Make sure register is exported if it wasn't before
      logout,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};