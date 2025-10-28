import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Globe } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-gray-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          
          {/* Brand and Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Link to="/login" className="flex items-center text-xl font-bold text-indigo-600 dark:text-indigo-400">
               BudgetTracker
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} BudgetTracker. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
              Quick Links
            </h3>
            <Link to="/dashboard" className="footer-link hover:text-blue-500">
              Dashboard
            </Link>
            <Link to="/budget" className="footer-link hover:text-blue-500">
              Budget
            </Link>
            
          </div>


          {/* Social Media and Contact */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
              Connect With Us
            </h3>
            <div className="flex space-x-4 text-gray-500 ">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon hover:text-blue-500">
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon hover:text-blue-500">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon hover:text-blue-500">
                <Instagram size={20} />
              </a>
              <a href="https://website.com" target="_blank" rel="noopener noreferrer" className="social-icon hover:text-blue-500">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
