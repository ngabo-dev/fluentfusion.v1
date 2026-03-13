import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Always default to dark theme
    return 'dark';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('ff_theme', theme);
    // Fire-and-forget preference sync to backend
    const token = localStorage.getItem('ff_access_token');
    if (token) {
      fetch('/api/v1/users/me/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ theme_preference: theme }),
      }).catch(() => {});
    }
  }, [theme]);

  const toggleTheme = () => setThemeState('dark'); // Always stay on dark theme
  const setTheme = (t: Theme) => setThemeState('dark'); // Always set to dark

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
