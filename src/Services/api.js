import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7251/api';
const TOKEN_KEY = 'token';

const getToken = () => localStorage.getItem(TOKEN_KEY);
const clearTokenAndRedirect = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = '/login';
};

export const api = axios.create({
  baseURL: API_URL  
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      clearTokenAndRedirect();
    }
    return Promise.reject(err);
  }
);

export const signupApi = axios.create({
  baseURL: API_URL,
});
