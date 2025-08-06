import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [individualType, setIndividualType] = useState('');
  const [location, setLocation] = useState('');
  const [idProof, setIdProof] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { error } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('individual_type', individualType);
      formData.append('id_proof', idProof);
      formData.append('location', location);

      const response = await axios.post('http://127.0.0.1:8000/api/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Registration successful:', response.data);
      navigate('/'); // Changed to redirect to the homepage
    } catch (err) {
      console.error('Registration error: ', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Create an account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Join AgriFarm to access resources</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., John Doe"
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} required placeholder="Minimum 8 characters"
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={validatePassword} required placeholder="Re-enter your password"
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-400" />
            {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Individual Type</label>
            <select value={individualType} onChange={(e) => setIndividualType(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
              <option value="" disabled hidden>Select your role</option>
              <option value="Farmer">Farmer</option>
              <option value="Government">Government</option>
              <option value="Bank">Bank</option>
              <option value="Corporate">Corporate</option>
              <option value="Event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g., Ahmedabad, Gujarat"
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload ID Proof</label>
            <input type="file" onChange={(e) => setIdProof(e.target.files[0])} required
              className="mt-1 block w-full text-sm text-gray-900 bg-white rounded-md border border-gray-300 cursor-pointer dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition font-medium focus:outline-none disabled:bg-green-400">
            {isLoading ? <Loader className="animate-spin h-5 w-5" /> : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500 dark:hover:text-green-400">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;