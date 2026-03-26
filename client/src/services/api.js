import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// TODO: Request interceptor — attach access token from AuthContext
// api.interceptors.request.use((config) => { ... });

// TODO: Response interceptor — on 401, try /auth/refresh, retry original request
// api.interceptors.response.use((res) => res, async (err) => { ... });

export default api;
