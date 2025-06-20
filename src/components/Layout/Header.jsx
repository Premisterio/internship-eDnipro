import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">Магазин</span>
          </Link>

          {/* Навігація */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-500' 
                  : 'text-gray-700 hover:text-blue-500'
              }`}
            >
              Головна
            </Link>

            <Link
              to="/products"
              className={`font-medium transition-colors ${
                isActive('/products') || location.pathname.startsWith('/products/')
                  ? 'text-blue-500' 
                  : 'text-gray-700 hover:text-blue-500'
              }`}
            >
              Товари
            </Link>
          </nav>

          {/* Бургер меню для моб. екранів */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Навігація для моб. екранів */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-500' 
                    : 'text-gray-700 hover:text-blue-500'
                }`}
              >
                Головна
              </Link>

              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium transition-colors ${
                  isActive('/products') || location.pathname.startsWith('/products/')
                    ? 'text-blue-500' 
                    : 'text-gray-700 hover:text-blue-500'
                }`}
              >
                Товари
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;