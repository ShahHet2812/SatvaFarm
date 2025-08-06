import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, AlertCircle, CheckCircle, X, Loader, RefreshCw } from 'lucide-react';
import axios from 'axios'; // Using axios for easier file uploads

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- File and Camera Handling (largely unchanged) ---

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    setAnalysisResult(null);

    if (!file.type.match('image.*')) {
      setError('Please select an image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // Increased to 10MB
      setError('File is too large. Maximum size is 10MB');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const startCamera = async () => {
    setShowCamera(true);
    resetStates(false); // Reset without clearing camera

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            validateAndSetFile(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // --- Backend Communication ---

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // IMPORTANT: Replace with your actual Django API endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/plant-health/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysisResult(response.data);
    } catch (err) {
      console.error('Analysis API error:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMsg = err.response.data?.error || 'An unknown error occurred on the server.';
        setError(`Analysis failed: ${errorMsg}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('Could not connect to the server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`An error occurred: ${err.message}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetStates = (fullReset = true) => {
    setSelectedFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (fullReset) {
      stopCamera();
    }
  };

  // --- Render Logic ---

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Plant Disease Detection</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload or capture a photo of a plant leaf to identify diseases and get treatment recommendations.
        </p>
      </div>
      
      {showCamera ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Camera Capture</h2>
            <button onClick={stopCamera} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
          <div className="mt-4 flex justify-center">
            <button onClick={capturePhoto} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Camera className="h-5 w-5 mr-2" /> Capture Photo
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 ${!preview ? 'border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400' : 'border-2 border-transparent'}`}
          onDragOver={handleDragOver} onDrop={handleDrop}
        >
          {!preview ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Upload className="h-12 w-12 text-green-500 dark:text-green-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload an Image</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                Drag & drop a file here, or click to select a file.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <ImageIcon className="h-5 w-5 mr-2" /> Select Image
                </button>
                <button onClick={startCamera} className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <Camera className="h-5 w-5 mr-2" /> Use Camera
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Preview</h2>
                <button onClick={() => resetStates(true)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <RefreshCw className="h-6 w-6" />
                </button>
              </div>
              <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
                <img src={preview} alt="Crop preview" className="w-full h-auto object-contain max-h-96" />
              </div>
              
              {!isAnalyzing && !analysisResult && (
                <div className="flex justify-center">
                  <button onClick={analyzeImage} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Analyze Image
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md flex items-center text-sm">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader className="h-10 w-10 text-green-600 dark:text-green-400 animate-spin mb-4" />
              <p className="text-gray-700 dark:text-gray-300">Analyzing your image... this may take a moment.</p>
            </div>
          )}
          
          {analysisResult && (
            <div className={`mt-6 p-6 rounded-lg border ${analysisResult.health === 'healthy' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
              <div className="flex items-center mb-4">
                {analysisResult.health === 'healthy' ? (
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {analysisResult.health === 'healthy' ? 'Analysis: Healthy' : `Analysis: ${analysisResult.issue}`}
                  </h3>
                </div>
              </div>
              
              {analysisResult.recommendation && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Recommendation:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{analysisResult.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;