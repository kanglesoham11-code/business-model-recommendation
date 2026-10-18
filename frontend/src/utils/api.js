import axios from 'axios';

// Base URL defaults to empty string for same-domain Vercel service routing, or uses VITE_API_URL if configured
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getCurrentUser: () => api.get('/api/auth/me'),
  refreshToken: (token) => api.post('/api/auth/refresh', { token }),
};

// Questionnaire API
export const questionnaireAPI = {
  create: (data) => api.post('/api/questionnaire', data),
  getById: (id) => api.get(`/api/questionnaire/${id}`),
  update: (id, data) => api.put(`/api/questionnaire/${id}`, data),
  delete: (id) => api.delete(`/api/questionnaire/${id}`),
  getUserQuestionnaires: () => api.get('/api/questionnaire/user/all'),
};

// Recommendation API
export const recommendationAPI = {
  generate: (questionnaireId) => api.post('/api/recommendations/generate', { questionnaireId }),
  simulateModel: (slug) => api.post('/api/recommendations/simulate', { slug }),
  getById: (id) => api.get(`/api/recommendations/${id}`),
  getAllModels: () => api.get('/api/recommendations/models/all'),
  getModelBySlug: (slug) => api.get(`/api/recommendations/models/${slug}`),
};

// Analytics API
export const analyticsAPI = {
  track: (eventType, eventData) => api.post('/api/analytics/track', { eventType, eventData }),
  getDashboard: () => api.get('/api/analytics/dashboard'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
};

export default api;
