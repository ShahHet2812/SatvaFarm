import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-6 bg-green-100 dark:bg-green-900 rounded-full">
            <Leaf className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;