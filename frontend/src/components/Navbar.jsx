import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';


// --- Dark Mode Toggle Button ---
const DarkModeToggle = ({ darkMode, toggleDarkMode }) => (
    <button
        onClick={toggleDarkMode}
        className="ml-4 p-2 rounded-full bg-blue-900 text-white shadow hover:bg-blue-800 transition"
        aria-label="Toggle dark mode"
    >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
);

const Navbar = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [darkMode, setDarkMode] = useState(() =>
            window.matchMedia("(prefers-color-scheme: dark)").matches
        );

        useEffect(() => {
            if (darkMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }, [darkMode]);

        const toggleDarkMode = () => setDarkMode((prev) => !prev);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Updated nav links with the dark blue color scheme
    const navLinks = (
        <>
            <Link
                to="/dashboard"
                // Blue color scheme for dark mode links
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                onClick={handleLinkClick}
            >
                Dashboard
            </Link>

            <Link
                to="/login"
                // Blue color scheme for dark mode links
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                onClick={handleLinkClick}
            >
                Login
            </Link>

            {/* Highlighted Sign Up Link (Primary color kept the same for branding) */}
            <Link
                to="/signup"
                className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md md:ml-4"
                onClick={handleLinkClick}
            >
                Sign Up
            </Link>
        </>
    );

    return (
        <nav className="bg-white dark:bg-blue-950 shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link
                        to="/"
                        className="flex items-center text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight"
                    >
                        BudgetTracker
                    </Link>
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks}
                        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </div>
                    <div className="md:hidden flex items-center gap-2">
                        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 border border-gray-300 dark:border-blue-700 rounded-lg text-gray-700 dark:text-blue-300 bg-gray-50 dark:bg-blue-900 hover:bg-gray-100 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150"
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="border-t border-gray-200 dark:border-blue-800 px-4 pt-2 pb-4 space-y-2 flex flex-col dark:bg-blue-950">
                    {navLinks}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;