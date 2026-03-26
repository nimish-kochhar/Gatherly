// TODO: Implement AuthContext with JWT access token in memory + refresh cookie
import { createContext } from 'react';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  // TODO: Store accessToken in state (never localStorage)
  // TODO: On mount, call POST /auth/refresh to restore session
  // TODO: Provide login, logout, user, isAuthenticated
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
