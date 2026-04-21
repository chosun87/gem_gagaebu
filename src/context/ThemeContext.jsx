import React, { createContext, useContext, useState, useEffect } from 'react';
import PrimeReact from 'primereact/api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'lara-light-cyan');
  const [scale, set_scale] = useState(parseInt(localStorage.getItem('app-scale')) || 14);
  const [ripple, set_ripple] = useState(localStorage.getItem('app-ripple') === 'false' ? false : true);
  const [inputStyle, set_inputStyle] = useState(localStorage.getItem('app-inputStyle') || 'outlined');
  const [condensed, set_condensed] = useState(localStorage.getItem('app-condensed') === 'true');

  useEffect(() => {
    const themeLink = document.getElementById('theme-link');
    if (themeLink) {
      const finalTheme = (condensed && theme.startsWith('md-')) ? theme.replace('md-', 'mdc-') : theme;
      themeLink.href = `https://unpkg.com/primereact/resources/themes/${finalTheme}/theme.css`;
    }
    localStorage.setItem('app-theme', theme);
  }, [theme, condensed]);

  useEffect(() => {
    document.documentElement.style.fontSize = scale + 'px';
    localStorage.setItem('app-scale', scale);
  }, [scale]);

  useEffect(() => {
    PrimeReact.ripple = ripple;
    localStorage.setItem('app-ripple', ripple);
  }, [ripple]);

  useEffect(() => {
    PrimeReact.inputStyle = inputStyle;
    localStorage.setItem('app-inputStyle', inputStyle);
  }, [inputStyle]);

  useEffect(() => {
    localStorage.setItem('app-condensed', condensed);
  }, [condensed]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{
      theme, changeTheme,
      scale, set_scale,
      ripple, set_ripple,
      inputStyle, set_inputStyle,
      condensed, set_condensed
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
