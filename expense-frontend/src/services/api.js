// src/services/api.js

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// --- CORRECTED FUNCTION ---
export function setAuthToken(token) {
  if (token) {
    // Use the 'Authorization' header and add the 'Bearer ' prefix
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}