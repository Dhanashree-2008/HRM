import React, { createContext, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// ThemeWrapper component
export const ThemeWrapper = ({ children, darkMode }) => {
  return (
    <ThemeContext.Provider value={darkMode}>
      <div className={darkMode ? 'theme-dark' : 'theme-light'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme - SIMPLIFIED - never throws
export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context; // Will be undefined if not in ThemeWrapper
};

// Helper function to get theme classes
export const getThemeClasses = (darkMode) => {
  // Default to false if darkMode is undefined
  const isDark = darkMode === true;
  
  return {
    // Backgrounds
    bg: {
      primary: isDark ? 'bg-gray-900' : 'bg-gray-50',
      secondary: isDark ? 'bg-gray-800' : 'bg-white',
      tertiary: isDark ? 'bg-gray-700' : 'bg-gray-100',
    },
    
    // Text
    text: {
      primary: isDark ? 'text-white' : 'text-gray-800',
      secondary: isDark ? 'text-gray-300' : 'text-gray-600',
      muted: isDark ? 'text-gray-400' : 'text-gray-500',
    },
    
    // Borders
    border: {
      primary: isDark ? 'border-gray-700' : 'border-gray-200',
      secondary: isDark ? 'border-gray-600' : 'border-gray-300',
    },
    
    // Inputs
    input: {
      bg: isDark ? 'bg-gray-900' : 'bg-gray-100',
      border: isDark ? 'border-gray-700' : 'border-gray-300',
      text: isDark ? 'text-white' : 'text-gray-800',
    },
  };
};

// Direct hook for theme classes
export const useThemeClasses = () => {
  const darkMode = useTheme();
  return getThemeClasses(darkMode);
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <ThemeContext.Provider value={darkMode}>
      <div className={darkMode ? "theme-dark" : "theme-light"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
