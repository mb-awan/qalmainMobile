import axios from 'axios';
import { Platform } from 'react-native';
import { resetToSignIn } from '../navigation/navigationRef';

// Qalmain Backend - Node Express TS + MongoDB
// In dev: Android emulator uses 10.0.2.2 for host; iOS simulator uses localhost.
// For physical device on same WiFi, set API_HOST to your computer's IP (e.g. '192.168.1.100').
const API_BASE_URL = __DEV__
  ? (() => {
      const host =
        typeof global.__API_HOST__ !== 'undefined'
          ? global.__API_HOST__
          : Platform.OS === 'android'
            ? '10.0.2.2'
            : 'localhost';
      return `http://${host}:3000/api`;
    })()
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
      const url = String(error.config?.url || '');
      const isAuthAttempt =
        url.includes('/users/login') ||
        url.includes('/users/register') ||
        url.includes('/users/login/verify-2fa');
      if (!isAuthAttempt) {
        void (async () => {
          await clearAuthToken();
          (onUnauthorized ?? defaultUnauthorized)();
        })();
      }
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

export const clearAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

let onUnauthorized: (() => void) | null = null;

/** Call from root navigator on mount; clears session and resets to Sign-in on 401. */
export const setUnauthorizedHandler = (fn: (() => void) | null): void => {
  onUnauthorized = fn;
};

const defaultUnauthorized = (): void => {
  resetToSignIn();
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
  getPrayerTimes: (
    lat: number,
    lng: number,
    date?: string,
    madhhab?: 'hanafi' | 'shafi',
  ) =>
    api.get('/azan/times', {
      params: {lat, lng, date, madhhab},
    }),
  getSettings: () => api.get('/azan/settings'),
  updateSettings: (settings: {
    enabled?: boolean;
    silentMode?: boolean;
    notifications?: boolean;
    madhhab?: 'hanafi' | 'shafi';
  }) => api.post('/azan/settings', settings),
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
};

export const userAPI = {
  register: (data: {email: string; password: string; name?: string}) =>
    api.post('/users/register', data),
  login: (data: {email: string; password: string}) =>
    api.post('/users/login', data),
  verify2faLogin: (data: {twoFactorToken: string; otp: string}) =>
    api.post('/users/login/verify-2fa', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: {name?: string; email?: string}) =>
    api.put('/users/profile', data),
  resendEmailVerification: () =>
    api.post('/users/security/email/resend'),
  verifyEmail: (data: {otp: string}) =>
    api.post('/users/security/email/verify', data),
  requestPasswordChangeOtp: () =>
    api.post('/users/security/password/otp'),
  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
    otp: string;
  }) => api.put('/users/security/password', data),
  requestTwoFactorEnableOtp: () =>
    api.post('/users/security/two-factor/otp'),
  enableTwoFactor: (data: {otp: string}) =>
    api.post('/users/security/two-factor/enable', data),
  disableTwoFactor: (data: {password: string}) =>
    api.post('/users/security/two-factor/disable', data),
  requestPasswordResetOtp: (data: { email: string }) =>
    api.post('/users/password/reset/otp', data),
  resetPasswordWithOtp: (data: { email: string; otp: string; newPassword: string }) =>
    api.post('/users/password/reset', data),
};

export const aiAPI = {
  startSession: () => api.post('/ai/session/start'),
  stopSession: () => api.post('/ai/session/stop'),
  getSessionStatus: () => api.get('/ai/session/status'),
  analyzeFrame: (data: {imageData: string; sessionId?: string}) =>
    api.post('/ai/analyze', data),
};

export default api;


