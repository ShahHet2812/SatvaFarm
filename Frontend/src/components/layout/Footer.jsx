import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo and about section - Spans 2 columns on medium screens */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SatvaFarm</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Empowering farmers globally with knowledge, resources, and connections to help them thrive.
            </p>
          </div>

          {/* Empty columns for spacing on larger screens */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Quick links */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm">
                  Schemes
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm">
                  Knowledge
                </Link>
              </li>
              <li>
                <Link to="/image-upload" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm">
                  Image Upload
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Empty columns for spacing on larger screens */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">LJ Campus, Sarkhej-Okaf, Ahmedabad.</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">+91 81606 41056</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">support@satvafarm.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SatvaFarm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;