import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;