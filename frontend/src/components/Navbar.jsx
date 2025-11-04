import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, UserPlus, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);


  const navLinks =
    <>
      <Link
        to="/dashboard"
        className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        Dashboard
      </Link>
      <Link
        to="/login"
        className="flex items-center px-3 py-2 rounded-md text-gray-700  hover:bg-gray-100 "
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="flex items-center px-3 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
      >
        Sign Up
      </Link>

      
    </>
  

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
          <div className="hidden md:flex items-center space-x-4">
            {navLinks}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-gray-900 shadow-md overflow-hidden transition-transform duration-300 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none" }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col justify-center">{navLinks}</div>
      </div>
    </nav>
  );
};

export default Navbar;
