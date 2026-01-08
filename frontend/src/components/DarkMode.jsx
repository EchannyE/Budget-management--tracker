import React from "react";
import { Sun, Moon } from "lucide-react";


const DarkModeToggle = ({ darkMode, toggleDarkMode }) => (
    <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full text-white dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors duration-200"
        aria-label="Toggle dark mode"
    >
        {/* Switch between Sun (light mode) and Moon (dark mode) icons */}
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
);

export default DarkModeToggle;
