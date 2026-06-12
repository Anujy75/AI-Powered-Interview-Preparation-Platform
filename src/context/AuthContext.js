import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, isAuthenticated: true, user: action.payload.user, token: action.payload.token, error: null };
    case 'AUTH_FAIL':
      return { ...state, loading: false, isAuthenticated: false, user: null, token: null, error: action.payload };
    case 'LOGOUT':
      return { ...state, loading: false, isAuthenticated: false, user: null, token: null, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ─── Axios default setup ───────────────────────────────────
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;

  // ─── Token header mein lagao ───────────────────────────────
useEffect(() => {
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'AUTH_FAIL', payload: null });
      return;
    }
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get('/auth/me');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: res.data.user, token }
      });
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken'); // ← ye add karo
      dispatch({ type: 'AUTH_FAIL', payload: null });
    }
  };
  loadUser();
}, []);

  // ─── Register ─────────────────────────────────────────────
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await axios.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, message };
    }
  };

  // ─── Login ────────────────────────────────────────────────
  const login = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await axios.post('/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, message };
    }
  };

  // ─── Logout ───────────────────────────────────────────────
const logout = async () => {
  // ✅ Pehle localStorage clear karo
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  delete axios.defaults.headers.common['Authorization'];
  
  // Phir dispatch karo
  dispatch({ type: 'LOGOUT' });
  
  // Phir API call karo (background mein)
  try {
    await axios.get('/auth/logout');
  } catch (err) {
    console.error(err);
  }
};

  // ─── Update User ───────────────────────────────────────────
  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // ─── Clear Error ──────────────────────────────────────────
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{
      ...state,
      register,
      login,
      logout,
      clearError,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;