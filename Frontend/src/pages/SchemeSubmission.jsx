import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Calendar, User, Mail, Phone, Tag, Loader, Check, ChevronLeft, Building, ExternalLink, FileText, ListOrdered, Award, Handshake, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SchemeSubmission = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user from the Auth context

  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    organizationName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    deadline: '',
    description: '',
    eligibility: '',
    benefits: '',
    documents: '',
    applicationProcess: '',
    website: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // This effect hook automatically sets the provider type from the user's role
  // It runs whenever the 'user' object from the context changes.
  useEffect(() => {
    if (user && user.individual_type) {
      const providerType = user.individual_type.toLowerCase();
      // Ensure the user type is one of the valid provider categories
      const validProviders = ['government', 'bank', 'corporate', 'event'];
      if (validProviders.includes(providerType)) {
        setFormData(prev => ({
          ...prev,
          provider: providerType
        }));
      }
    }
  }, [user]); // The dependency array ensures this runs when the user object is loaded

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Scheme title is required';
    if (!formData.provider) newErrors.provider = 'Provider type is required';
    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.deadline.trim()) newErrors.deadline = 'Deadline is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.eligibility.trim()) newErrors.eligibility = 'Eligibility criteria is required';
    if (!formData.benefits.trim()) newErrors.benefits = 'Benefits is required';
    
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    if (formData.website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0] || Object.keys(validateForm())[0];
      if (firstErrorKey) {
        const element = document.getElementsByName(firstErrorKey)[0];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/scheme/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setErrors(prev => ({...prev, ...errorData, form: 'Please correct the errors below.'}));
      }
    } catch (error) {
      console.error('Error submitting scheme:', error);
      setErrors({
        form: 'There was an error submitting your scheme. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Scheme Submitted Successfully</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Thank you for your submission. Our team will review it, and it will be published on the platform shortly.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/schemes')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Schemes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = (field) => 
    `px-3 py-2 shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors[field] ? 'border-red-300 dark:border-red-500' : ''}`;

  // Helper function to capitalize the first letter for display purposes
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/schemes')}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Schemes
        </button>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Submit a New Scheme</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Share agricultural schemes, subsidies, or events with our farming community.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-10">
          {errors.form && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-700 dark:text-red-300">
              {errors.form}
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><Info className="h-6 w-6 mr-3 text-green-600"/>Scheme Details</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Scheme Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={inputClass('title')}
                  placeholder="e.g., Pradhan Mantri Fasal Bima Yojana"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider Type *
                </label>
                <input
                  type="text"
                  name="provider"
                  id="provider"
                  value={capitalize(formData.provider)}
                  readOnly
                  className={`${inputClass('provider')} bg-gray-100 dark:bg-gray-600 cursor-not-allowed`}
                  placeholder="Auto-filled"
                />
                {errors.provider && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.provider}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organization Name *
                </label>
                <input type="text" name="organizationName" id="organizationName" value={formData.organizationName} onChange={handleInputChange} className={inputClass('organizationName')} placeholder="e.g., Ministry of Agriculture"/>
                {errors.organizationName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organizationName}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Deadline *
                </label>
                <input type="date" name="deadline" id="deadline" value={formData.deadline} onChange={handleInputChange} className={inputClass('deadline')}/>
                {errors.deadline && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>}
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleInputChange} className={inputClass('description')} placeholder="Provide a detailed description of the scheme, its purpose, and goals."/>
                {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Users className="h-4 w-4 inline mr-1"/>Eligibility Criteria *
                </label>
                <textarea id="eligibility" name="eligibility" rows={4} value={formData.eligibility} onChange={handleInputChange} className={inputClass('eligibility')} placeholder="Who is eligible? e.g., All farmers, Small and marginal farmers, FPOs."/>
                {errors.eligibility && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.eligibility}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Award className="h-4 w-4 inline mr-1"/>Benefits *
                </label>
                <textarea id="benefits" name="benefits" rows={4} value={formData.benefits} onChange={handleInputChange} className={inputClass('benefits')} placeholder="What are the key benefits? e.g., 3% interest subvention, Up to ₹2 crore loan."/>
                {errors.benefits && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.benefits}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="documents" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText className="h-4 w-4 inline mr-1"/>Required Documents
                </label>
                <textarea id="documents" name="documents" rows={4} value={formData.documents} onChange={handleInputChange} className={inputClass('documents')} placeholder="List necessary documents. e.g., Aadhaar Card, Land Records, Bank Passbook."/>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="applicationProcess" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <ListOrdered className="h-4 w-4 inline mr-1"/>Application Process
                </label>
                <textarea id="applicationProcess" name="applicationProcess" rows={4} value={formData.applicationProcess} onChange={handleInputChange} className={inputClass('applicationProcess')} placeholder="Describe the application steps. e.g., 1. Visit official portal. 2. Register and fill form. 3. Upload documents."/>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   <ExternalLink className="h-4 w-4 inline mr-1"/>Official Website
                </label>
                <input type="text" name="website" id="website" value={formData.website} onChange={handleInputChange} className={inputClass('website')} placeholder="https://pmfby.gov.in"/>
                {errors.website && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Tag className="h-4 w-4 inline mr-1"/>Tags
                </label>
                <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleInputChange} className={inputClass('tags')} placeholder="e.g., insurance, crop loan, subsidy"/>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comma-separated tags to improve searchability.</p>
              </div>
            </div>
          </div>
          
          <hr className="dark:border-gray-700"/>

          <div className="space-y-6">
             <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><Handshake className="h-6 w-6 mr-3 text-green-600"/>Contact Information</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Person *
                </label>
                <input type="text" name="contactName" id="contactName" value={formData.contactName} onChange={handleInputChange} className={inputClass('contactName')} placeholder="e.g., Rajesh Kumar"/>
                {errors.contactName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactName}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className={inputClass('contactEmail')} placeholder="contact@example.gov.in"/>
                {errors.contactEmail && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactEmail}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input type="tel" name="contactPhone" id="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className={inputClass('contactPhone')} placeholder="1800-111-2222"/>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/schemes')}
                className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Scheme'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemeSubmission;