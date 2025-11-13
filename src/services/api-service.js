// src/services/api-service.js
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';


const API_URL = 'http://192.168.31.152:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await EncryptedStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && error.request) {
      // No internet
      throw new Error('No internet connection. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default api;