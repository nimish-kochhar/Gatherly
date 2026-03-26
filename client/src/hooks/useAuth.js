// TODO: Implement useAuth hook (access token in memory, refresh via cookie)
import { useContext } from 'react';

export default function useAuth() {
  return { user: null, isAuthenticated: false, login: () => {}, logout: () => {} };
}
