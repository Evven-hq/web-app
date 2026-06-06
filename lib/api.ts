import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL : API_URL,
    timeout : 10000,
})

api.interceptors.request.use( (config) => {
    if(typeof window !== 'undefined'){
        const token = localStorage.getItem('access_token');
        if (token) {
                config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return config;
})

export default api;