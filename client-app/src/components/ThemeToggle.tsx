import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../context/useThemeStore';

export const ThemeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md transition-colors duration-200 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
    );
};
