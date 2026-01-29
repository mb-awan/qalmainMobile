import axios from 'axios';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async config => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      clearAuthToken();
    }
    return Promise.reject(error);
  },
);

// Token management (using AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const clearAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

// API endpoints
export const quranAPI = {
  getPage: (pageNumber: number) => api.get(`/quran/page/${pageNumber}`),
  getPara: (paraNumber: number) => api.get(`/quran/para/${paraNumber}`),
  getAyah: (surah: number, ayah: number) =>
    api.get(`/quran/ayah/${surah}/${ayah}`),
  search: (query: string) => api.get('/quran/search', {params: {query}}),
};

export const bookmarkAPI = {
  getAll: () => api.get('/bookmarks'),
  get: (id: string) => api.get(`/bookmarks/${id}`),
  add: (data: {surah: number; ayah: number; page?: number}) =>
    api.post('/bookmarks', data),
  remove: (id: string) => api.delete(`/bookmarks/${id}`),
};

export const azanAPI = {
  getPrayerTimes: (lat: number, lng: number, date?: string) =>
    api.get('/azan/times', {params: {lat, lng, date}}),
  getSettings: () => api.get('/azan/settings'),
  updateSettings: (settings: {
    enabled?: boolean;
    silentMode?: boolean;
    notifications?: boolean;
  }) => api.post('/azan/settings', settings),
};

export const userAPI = {
  register: (data: {email: string; password: string; name?: string}) =>
    api.post('/users/register', data),
  login: (data: {email: string; password: string}) =>
    api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: {name?: string; email?: string}) =>
    api.put('/users/profile', data),
};

export const aiAPI = {
  startSession: () => api.post('/ai/session/start'),
  stopSession: () => api.post('/ai/session/stop'),
  getSessionStatus: () => api.get('/ai/session/status'),
  analyzeFrame: (data: {imageData: string; sessionId?: string}) =>
    api.post('/ai/analyze', data),
};

export default api;


