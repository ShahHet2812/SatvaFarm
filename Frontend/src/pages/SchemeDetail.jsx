import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clover as Government, Building2, Building as BuildingOffice, Calendar, User, Mail, Phone, ArrowLeft, Download, ExternalLink, Clock, AlertTriangle, Paperclip as PaperClip } from 'lucide-react';

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/scheme/${id}/`);
        if (response.ok) {
          const data = await response.json();
          setScheme(data);
        } else {
          console.error('Scheme not found');
        }
      } catch (error) {
        console.error('Error fetching scheme details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  // Helper function to get icon based on provider
  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'government':
        return <Government className="h-6 w-6" />;
      case 'bank':
        return <Building2 className="h-6 w-6" />;
      case 'corporate':
        return <BuildingOffice className="h-6 w-6" />;
      case 'event':
        return <Calendar className="h-6 w-6" />;
      default:
        return null;
    }
  };

  // Helper function to get provider label
  const getProviderLabel = (provider) => {
    switch (provider) {
      case 'government':
        return 'Government Scheme';
      case 'bank':
        return 'Bank Offering';
      case 'corporate':
        return 'Corporate Initiative';
      case 'event':
        return 'Agricultural Event';
      default:
        return '';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate remaining days
  const calculateRemainingDays = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-green-600 border-r-transparent dark:border-green-400 dark:border-r-transparent"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading scheme details...</p>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Scheme Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The scheme you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/schemes"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schemes
          </Link>
        </div>
      </div>
    );
  }

  const remainingDays = calculateRemainingDays(scheme.deadline);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/schemes')}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Schemes
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Scheme Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20`}>
              {getProviderIcon(scheme.provider)}
              <span className="ml-1">{getProviderLabel(scheme.provider)}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">{scheme.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {scheme.tags && scheme.tags.split(',').map(tag => (
              <span 
                key={tag} 
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 capitalize"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Deadline Banner */}
        <div className={`px-6 py-3 flex items-center justify-between ${
          remainingDays <= 7 ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300' : 
          remainingDays <= 30 ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' : 
          'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
        }`}>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-medium">Application Deadline: {formatDate(scheme.deadline)}</span>
          </div>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              remainingDays <= 7 ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' : 
              remainingDays <= 30 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' : 
              'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
            }`}>
              {remainingDays <= 0 ? (
                'Deadline passed'
              ) : (
                `${remainingDays} days remaining`
              )}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Scheme Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About the Scheme</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {scheme.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Eligibility */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Eligibility</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {scheme.eligibility}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Benefits</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {scheme.benefits}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {scheme.documents && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Required Documents</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start">
                  <PaperClip className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {scheme.documents}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Application Process */}
          {scheme.applicationProcess && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Apply</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {scheme.applicationProcess}
                </p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">{scheme.contactName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <a href={`mailto:${scheme.contactEmail}`} className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                  {scheme.contactEmail}
                </a>
              </div>
              {scheme.contactPhone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <a href={`tel:${scheme.contactPhone}`} className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                    {scheme.contactPhone}
                  </a>
                </div>
              )}
              {scheme.website && (
                <div className="flex items-center">
                  <ExternalLink className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <a 
                    href={scheme.website.startsWith('http') ? scheme.website : `https://${scheme.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Official Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            {remainingDays > 0 ? (
              /*
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Application Form
              </button>
              */
              null
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 inline-block">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Application deadline has passed. Please check back for future opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;