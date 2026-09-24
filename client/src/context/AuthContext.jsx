import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pathfinder_token') || null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);

  const logout = () => {
    localStorage.removeItem('pathfinder_token');
    localStorage.removeItem('pathfinder_user');
    setToken(null);
    setUser(null);
    setBookmarks([]);
  };

  // Fetch current user and bookmarks on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('pathfinder_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          // Also fetch user bookmarks
          const bmRes = await api.get('/bookmarks');
          setBookmarks(bmRes.data.data || []);
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('pathfinder_token', newToken);
    localStorage.setItem('pathfinder_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    // Fetch bookmarks
    try {
      const bmRes = await api.get('/bookmarks');
      setBookmarks(bmRes.data.data || []);
    } catch {
      // Ignored
    }

    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem('pathfinder_token', newToken);
    localStorage.setItem('pathfinder_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setBookmarks([]);
    return newUser;
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    const updatedUser = res.data.data;
    setUser(updatedUser);
    localStorage.setItem('pathfinder_user', JSON.stringify(updatedUser));
    return updatedUser;
  };


  // Bookmark actions
  const fetchBookmarks = async () => {
    if (!token) return;
    try {
      const res = await api.get('/bookmarks');
      setBookmarks(res.data.data || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  const addBookmark = async (itemType, itemId) => {
    if (!user) return false;
    try {
      await api.post('/bookmarks', { itemType, itemId });
      await fetchBookmarks();
      return true;
    } catch (err) {
      console.error('Failed to bookmark item:', err);
      return false;
    }
  };

  const removeBookmark = async (idOrItemId) => {
    if (!user) return false;
    try {
      await api.delete(`/bookmarks/${idOrItemId}`);
      await fetchBookmarks();
      return true;
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
      return false;
    }
  };

  const isBookmarked = (itemId) => {
    return bookmarks.some((b) => b.itemId === itemId || (b.item && b.item._id === itemId));
  };

  const value = {
    user,
    token,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    updateProfile,
    logout,
    bookmarks,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
