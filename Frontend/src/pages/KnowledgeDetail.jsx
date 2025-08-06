import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const KnowledgeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch article detail
        const response = await axios.get(`http://localhost:8000/api/articles/${id}/`);
        setArticle(response.data);
        
        // Fetch related articles (you might want to implement this endpoint)
        try {
          const relatedResponse = await axios.get(`http://localhost:8000/api/articles/?category=${response.data.category}&limit=3`);
          setRelatedArticles(relatedResponse.data.filter(a => a.id !== parseInt(id)));
        } catch (error) {
          console.log('Related articles not available');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

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
    const wordCount = description?.split(' ').length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // Here you would typically save to backend or localStorage
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-4">Article not found</h2>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist.</p>
          <Link
            to="/knowledge"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Knowledge Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link to="/knowledge" className="text-gray-400 hover:text-white transition-colors">
              Knowledge Base
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-green-400 truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Articles
        </button>

        {/* Article Header */}
        <div className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white">
              <span className="mr-2">{getCategoryIcon(article.category)}</span>
              {article.category || 'General'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getReadingTime(article.description)} min read
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleBookmark}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                bookmarked
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-12">
          {/* Featured Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Article Body */}
          <div className="p-8">
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-lg leading-relaxed text-gray-300 whitespace-pre-line">
                {article.description}
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map(relatedArticle => (
                <Link
                  to={`/knowledge/${relatedArticle.id}`}
                  key={relatedArticle.id}
                  className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-600 text-white rounded mb-2">
                      {getCategoryIcon(relatedArticle.category)} {relatedArticle.category}
                    </span>
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {relatedArticle.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation to Next/Previous Articles */}
        <div className="flex justify-center bg-gray-800 rounded-lg p-6 mb-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Found this helpful?</p>
            <Link
              to="/knowledge"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
            >
              Explore More Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeDetail;