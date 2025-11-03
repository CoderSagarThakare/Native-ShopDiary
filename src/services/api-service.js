// src/services/api-service.js
import axios from 'axios';

const API_URL = 'http://192.168.31.3:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;