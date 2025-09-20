// lib/myAxios.ts
import axios from 'axios';

const myAxios = axios.create({
    baseURL: 'https://devapi01.awfatech.com/',
    timeout: 15000, // 15 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
myAxios.interceptors.request.use(
    (config) => {
        // Add any default headers or auth tokens here
        if (typeof window !== 'undefined') {
            const encryptedKey = localStorage.getItem('x-encrypted-key');
            const userToken = localStorage.getItem('userToken');

            if (encryptedKey && config.headers) {
                config.headers['x-encrypted-key'] = encryptedKey;
            }

            if (userToken && config.headers) {
                config.headers['Authorization'] = `Bearer ${userToken}`;
            }
        }

        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    },
);

// Response interceptor
myAxios.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            url: error.config?.url,
        });

        // Handle 401 unauthorized errors
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            // Clear tokens and redirect to app code page
            localStorage.removeItem('x-encrypted-key');
            localStorage.removeItem('userToken');
            localStorage.removeItem('user_id');
            localStorage.removeItem('encrypted_user');
            window.location.href = '/auth/app-code';
        }

        return Promise.reject(error);
    },
);

export default myAxios;
