import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

/**
 * Token management — the AuthContext sets this when the user logs in.
 * We use a module-level getter so the interceptor always reads fresh state.
 */
let getAccessToken = () => null;

export function setTokenAccessor(getter) {
  getAccessToken = getter;
}



// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — on 401, try /auth/refresh, retry original request
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Don't intercept refresh or login/register calls themselves
    if (
      !err.response ||
      err.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === '/auth/refresh' ||
      originalRequest.url === '/auth/login' ||
      originalRequest.url === '/auth/register'
    ) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      // Queue this request while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post('/auth/refresh');
      const newToken = data.accessToken;

      // Notify AuthContext of the new token
      if (typeof onTokenRefreshedCallback === 'function') {
        onTokenRefreshedCallback(newToken);
      }

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Callback reference for token refresh
let onTokenRefreshedCallback = () => {};

export function setOnTokenRefreshed(callback) {
  onTokenRefreshedCallback = callback;
}

export default api;
