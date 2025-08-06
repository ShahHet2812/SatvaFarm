import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, Clover as Government, Building2, Building as BuildingOffice, Calendar, PlusCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Schemes = () => {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [allSchemes, setAllSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    provider: [],
    tags: []
  });

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch('/api/scheme/');
        const data = await response.json();
        setSchemes(data);
        setAllSchemes(data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      }
    };

    fetchSchemes();
  }, []);

  const allTags = Array.from(
    new Set(allSchemes.flatMap(scheme => scheme.tags.split(',').map(tag => tag.trim())))
  ).sort();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleProviderFilter = (provider) => {
    setActiveFilters(prev => ({
      ...prev,
      provider: prev.provider.includes(provider)
        ? prev.provider.filter(p => p !== provider)
        : [...prev.provider, provider]
    }));
  };

  const toggleTagFilter = (tag) => {
    setActiveFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setActiveFilters({ provider: [], tags: [] });
    setSearchTerm('');
  };

  useEffect(() => {
    let filtered = allSchemes;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(scheme => 
        scheme.title.toLowerCase().includes(term) || 
        scheme.description.toLowerCase().includes(term)
      );
    }
    
    if (activeFilters.provider.length > 0) {
      filtered = filtered.filter(scheme => 
        activeFilters.provider.includes(scheme.provider)
      );
    }
    
    if (activeFilters.tags.length > 0) {
      filtered = filtered.filter(scheme => 
        scheme.tags.split(',').map(tag => tag.trim()).some(tag => activeFilters.tags.includes(tag))
      );
    }
    
    setSchemes(filtered);
  }, [searchTerm, activeFilters, allSchemes]);

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'government': return <Government className="h-5 w-5" />;
      case 'bank': return <Building2 className="h-5 w-5" />;
      case 'corporate': return <BuildingOffice className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      default: return null;
    }
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'government': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'bank': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'corporate': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'event': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default: return '';
    }
  };

  const getProviderLabel = (provider) => {
    switch (provider) {
      case 'government': return 'Government';
      case 'bank': return 'Bank';
      case 'corporate': return 'Corporate';
      case 'event': return 'Event';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agricultural Schemes</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Discover government, bank, and corporate schemes to support your farming journey
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          {user && user.individual_type !== 'Farmer' && (
            <Link
              to="/schemes/submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit a Scheme
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative inline-block">
              <button
                type="button"
                onClick={toggleFilter} // <-- Attach toggle function
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(activeFilters.provider.length > 0 || activeFilters.tags.length > 0) && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {activeFilters.provider.length + activeFilters.tags.length}
                  </span>
                )}
              </button>
              
              {/* Conditionally render dropdown */}
              {isFilterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10 divide-y divide-gray-100 dark:divide-gray-600">
                  <div className="py-1">
                    <div className="px-4 py-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Provider Type</h3>
                      <div className="mt-2 space-y-2">
                        {['government', 'bank', 'corporate', 'event'].map((provider) => (
                          <div key={provider} className="flex items-center">
                            <input
                              id={`filter-${provider}`}
                              name={`filter-${provider}`}
                              type="checkbox"
                              checked={activeFilters.provider.includes(provider)}
                              onChange={() => toggleProviderFilter(provider)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`filter-${provider}`} className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                              {getProviderLabel(provider)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <div className="px-4 py-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Tags</h3>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {allTags.map((tag) => (
                          <div key={tag} className="flex items-center">
                            <input
                              id={`filter-tag-${tag}`}
                              name={`filter-tag-${tag}`}
                              type="checkbox"
                              checked={activeFilters.tags.includes(tag)}
                              onChange={() => toggleTagFilter(tag)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`filter-tag-${tag}`} className="ml-2 text-sm text-gray-700 dark:text-gray-200 capitalize">
                              {tag}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {(activeFilters.provider.length > 0 || activeFilters.tags.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilters.provider.map(provider => (
              <span 
                key={provider}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {getProviderLabel(provider)}
                <button
                  type="button"
                  onClick={() => toggleProviderFilter(provider)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {activeFilters.tags.map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 capitalize"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => toggleTagFilter(tag)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {schemes.length > 0 ? (
          schemes.map(scheme => (
            <div key={scheme.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProviderColor(scheme.provider)}`}>
                        {getProviderIcon(scheme.provider)}
                        <span className="ml-1">{getProviderLabel(scheme.provider)}</span>
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        Deadline: {formatDate(scheme.deadline)}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {scheme.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                      {scheme.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scheme.tags.split(',').map(tag => (
                        <span 
                          key={tag} 
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 capitalize"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    View details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No schemes found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find more schemes.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;