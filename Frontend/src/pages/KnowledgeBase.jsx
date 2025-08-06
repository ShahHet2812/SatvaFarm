import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const KnowledgeBase = () => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const categories = ['Crops', 'Vegetables', 'Pests', 'Diseases', 'Techniques', 'Seasonal'];
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/articles/');
        setArticles(response.data);
        setFilteredArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(article =>
        selectedCategories.some(category =>
          article.category?.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(article =>
        selectedTags.some(tag =>
          article.tags?.some(articleTag =>
            articleTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategories, selectedTags]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchTerm('');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Crops': '🌾',
      'Vegetables': '🥕',
      'Pests': '🐛',
      'Diseases': '🦠',
      'Techniques': '🔧',
      'Seasonal': '🌱'
    };
    return icons[category] || '📖';
  };

  const getReadingTime = (description) => {
    const wordsPerMinute = 200;
    const wordCount = description.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header Section */}
      <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-green-600 to-green-800'} py-16 px-4`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Farming Knowledge Base
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-white'} mb-8`}>
            Educational resources and guides to help you improve your agricultural practices
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-6 py-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Articles */}
          <div className="flex-1">
            {/* Results Count and Filter Toggle for Mobile */}
            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {filteredArticles.length} of {articles.length} articles
              </p>
              
              {/* Filter Toggle Button for Mobile Only */}
              <button
                onClick={toggleFilter}
                className={`lg:hidden flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors border`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                  <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    {selectedCategories.length + selectedTags.length}
                  </span>
                )}
                <svg 
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <Link
                    to={`/knowledge/${article.id}`}
                    key={article.id}
                    className={`group ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105`}
                  >
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                          <span className="mr-1">{getCategoryIcon(article.category)}</span>
                          {article.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6">
                      <h3 className={`text-lg font-semibold mb-3 group-hover:text-green-400 transition-colors line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {article.title}
                      </h3>
                      
                      <p className={`text-sm mb-4 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {article.description}
                      </p>

                      {/* Article Meta */}
                      <div className={`flex items-center justify-between text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getReadingTime(article.description)} min read
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-green-600 text-white rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="inline-block px-2 py-1 text-xs bg-green-600 text-white rounded-full">
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar Filters - Dropdown Style */}
          <div className={`lg:w-80 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
            {/* Filter Header with Dropdown Toggle */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-4 mb-4`}>
              <button
                onClick={toggleFilter}
                className="w-full flex items-center justify-between text-lg font-semibold hover:text-green-400 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter by Topics
                  {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                    <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-1">
                      {selectedCategories.length + selectedTags.length}
                    </span>
                  )}
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Clear All Filters - Always visible when filters are active */}
              {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-3 text-sm text-red-400 hover:text-red-300 underline transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Collapsible Filter Content */}
            <div className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${isFilterOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
              {/* Categories Filter */}
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-4`}>
                <h4 className="font-semibold mb-3 text-green-400">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className={`flex items-center cursor-pointer p-2 rounded transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className={`mr-3 rounded text-green-500 focus:ring-green-500 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;