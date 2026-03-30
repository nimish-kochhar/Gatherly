import { createContext, useState, useEffect, useCallback } from 'react';

/**
 * ThemeContext — Manages dark/light mode across the entire app.
 *
 * How it works:
 *   1. On first load, checks localStorage for a saved preference
 *   2. If none found, checks the user's OS/browser preference (prefers-color-scheme)
 *   3. Falls back to 'dark' as default
 *   4. Adds/removes the 'dark' class on <html>, which Tailwind's dark: variant uses
 *   5. Saves preference to localStorage whenever the user toggles
 *
 * Provides to consumers:
 *   - theme: 'dark' | 'light'
 *   - toggleTheme: function to switch between dark/light
 *   - isDark: boolean shorthand
 */
export const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
  // --- Initialize theme from localStorage or system preference ---
  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage first
    const saved = localStorage.getItem('gatherly-theme');
    if (saved === 'dark' || saved === 'light') return saved;

    // 2. Check system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    // 3. Default to dark
    return 'dark';
  });

  // --- Sync the theme to the DOM and localStorage ---
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('gatherly-theme', theme);
  }, [theme]);

  // --- Toggle function (memoized so it doesn't cause re-renders) ---
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
