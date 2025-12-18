import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  getProfile: async (token) => {
    const response = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.user;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response;
  }
};
