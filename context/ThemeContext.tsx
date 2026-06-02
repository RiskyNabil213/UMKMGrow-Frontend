"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);

  // Baca dari localStorage saat mount
  useEffect(() => {
    const saved = localStorage.getItem("dark_mode");
    const isDark = saved === "true";
    setDarkModeState(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  function setDarkMode(v: boolean) {
    setDarkModeState(v);
    localStorage.setItem("dark_mode", String(v));
    if (v) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
