import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api/blogs';
const AUTH_URL = API_URL.replace('/blogs', '/auth');

const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${AUTH_URL}/login`, { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  register: async (email, password) => {
    const response = await axios.post(`${AUTH_URL}/register`, { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  verifyToken: async () => {
    try {
      const token = authService.getToken();
      if (!token) return false;

      const response = await axios.get(`${AUTH_URL}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.success;
    } catch (error) {
      authService.logout();
      return false;
    }
  }
};

export default authService;
