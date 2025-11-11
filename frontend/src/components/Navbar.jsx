import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navLinks = (
    <>
      <Link
        to="/dashboard"
        className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        onClick={handleLinkClick}
      >
        Dashboard
      </Link>

      
      <Link
        to="/login"
        className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        onClick={handleLinkClick}
      >
        Login
      </Link>

      {/* Highlighted Sign Up Link (Consistent styling for both desktop and mobile) */}
      <Link
        to="/signup"
        // Use a clearer margin/spacing on desktop (md:ml-4)
        className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md md:ml-4"
        onClick={handleLinkClick}
      >
        Sign Up
      </Link>
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight"
          >
            BudgetTracker
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks}
          </div>

          {/* Mobile Menu Button - IMPROVED UI */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - IMPROVED TRANSITION */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Added a border top for visual separation */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 pt-2 pb-4 space-y-2 flex flex-col">
          {navLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;