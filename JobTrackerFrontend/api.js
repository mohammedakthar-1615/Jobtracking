import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your computer's IP address (update to your machine's LAN IP)
const BASE_URL = 'http://192.168.1.44:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;