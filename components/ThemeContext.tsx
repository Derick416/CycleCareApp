import React, { createContext, useContext, useState } from 'react';

export type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    primaryDark: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textSecondary: string;
    border: string;
    tabBar: string;
    header: string;
    shadow: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#C2185B',
    primaryDark: '#880E4F',
    background: '#FFF5F8',
    surface: '#FFFFFF',
    surfaceAlt: '#FCE4EC',
    text: '#1A1A2E',
    textSecondary: '#6B6B80',
    border: '#F8BBD0',
    tabBar: '#FFFFFF',
    header: '#C2185B',
    shadow: '#C2185B',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#E91E8C',
    primaryDark: '#C2185B',
    background: '#0D0D1A',
    surface: '#1A1A2E',
    surfaceAlt: '#16213E',
    text: '#F8F8FF',
    textSecondary: '#A0A0B8',
    border: '#2D2D4E',
    tabBar: '#1A1A2E',
    header: '#0D0D1A',
    shadow: '#000',
  },
};

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: lightTheme, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((v) => !v);
  return (
    <ThemeContext.Provider value={{ theme: isDark ? darkTheme : lightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
