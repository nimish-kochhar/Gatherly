// TODO: Implement ThemeContext (light/dark mode)
import { createContext } from 'react';

export const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
