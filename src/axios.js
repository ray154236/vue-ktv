// src/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/ktv-app',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token'); // 改為 sessionStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;
