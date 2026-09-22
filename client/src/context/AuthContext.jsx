import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import api, { setTokenAccessor, setOnTokenRefreshed } from '../services/api.js';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session
  const tokenRef = useRef(null);
  const isRestoring = useRef(false);

  // Keep the token ref in sync so the Axios interceptor always reads the latest
  useEffect(() => {
    tokenRef.current = accessToken;
    setTokenAccessor(() => tokenRef.current);
  }, [accessToken]);

  // Let the refresh interceptor update our token state
  useEffect(() => {
    setOnTokenRefreshed((newToken) => {
      setAccessToken(newToken);
    });
  }, []);

  /**
   * On mount, try to restore the session via the refresh cookie.
   */
  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    if (isRestoring.current) return;
    isRestoring.current = true;
    try {
      const { data } = await api.post('/auth/refresh');
      setAccessToken(data.accessToken);
      tokenRef.current = data.accessToken;

      const meRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      setUser(meRes.data.user);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
      isRestoring.current = false;
    }
  }

  const login = useCallback(async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async ({ username, email, password }) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    }
    setUser(null);
    setAccessToken(null);
  }, []);

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
