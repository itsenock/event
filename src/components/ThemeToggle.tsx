import React, { useEffect, useState, useCallback } from "react";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/solid";

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  showSystemOption?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  position = 'top-right',
  size = 'md',
  showSystemOption = true
}) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme') as ThemeMode;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      return saved;
    }
    return 'system';
  });

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  const applyTheme = useCallback((newTheme: ThemeMode) => {
    const root = document.documentElement;
    const systemTheme = getSystemTheme();
    
    let effectiveTheme: 'light' | 'dark' = systemTheme;
    
    if (newTheme === 'light' || newTheme === 'dark') {
      effectiveTheme = newTheme;
    }

    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    root.style.colorScheme = effectiveTheme;
    
    setCurrentTheme(effectiveTheme);
    localStorage.setItem('theme', newTheme);
  }, [getSystemTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    const themes: ThemeMode[] = showSystemOption 
      ? ['light', 'dark', 'system'] 
      : ['light', 'dark'];
    
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [theme, showSystemOption]);

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
    };
    return positions[position];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };
    return sizes[size];
  };

  const getThemeLabel = () => {
    const labels = {
      light: 'Light theme',
      dark: 'Dark theme',
      system: 'System theme',
    };
    return labels[theme];
  };

  const renderIcon = () => {
    const iconClass = getIconSize();
    
    if (theme === 'system') {
      return <ComputerDesktopIcon className={iconClass} />;
    }
    
    return currentTheme === 'dark' ? (
      <MoonIcon className={iconClass} />
    ) : (
      <SunIcon className={iconClass} />
    );
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        fixed ${getPositionClasses()} ${getSizeClasses()}
        bg-white dark:bg-gray-800 
        text-gray-900 dark:text-white 
        rounded-full shadow-lg 
        border border-gray-200 dark:border-gray-700
        hover:scale-105 active:scale-95 
        transition-all duration-200 
        z-50
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        group
      `}
      aria-label={`Toggle theme. Current: ${getThemeLabel()}`}
      title={getThemeLabel()}
    >
      {renderIcon()}
      
      {/* Tooltip */}
      <div className="
        absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
        px-2 py-1 text-xs font-medium
        bg-gray-900 dark:bg-white 
        text-white dark:text-gray-900 
        rounded opacity-0 group-hover:opacity-100 
        transition-opacity duration-200
        pointer-events-none
        whitespace-nowrap
      ">
        {getThemeLabel()}
        {showSystemOption && theme === 'system' && (
          <div className="text-xs opacity-75">
            ({currentTheme})
          </div>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;