import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((config) => { const token = localStorage.getItem('carshop_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((response) => response, (error) => { if (error.response?.status === 401) { localStorage.removeItem('carshop_token'); localStorage.removeItem('carshop_user'); window.dispatchEvent(new Event('carshop:logout')); } return Promise.reject(error); });
export const messageOf = (error) => error.response?.data?.message || error.message || 'Something went wrong';
export default api;
