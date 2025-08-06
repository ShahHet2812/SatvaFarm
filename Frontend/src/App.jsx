import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ImageUpload from './pages/ImageUpload';
import Schemes from './pages/Schemes';
import SchemeSubmission from './pages/SchemeSubmission';
import SchemeDetail from './pages/SchemeDetail';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeDetail from './pages/KnowledgeDetail';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route 
                path="image-upload" 
                element={
                  <PrivateRoute>
                    <ImageUpload />
                  </PrivateRoute>
                } 
              />
              <Route path="schemes" element={<Schemes />} />
              <Route 
                path="schemes/submit" 
                element={
                  <PrivateRoute>
                    <SchemeSubmission />
                  </PrivateRoute>
                } 
              />
              <Route path="schemes/:id" element={<SchemeDetail />} />
              <Route path="knowledge" element={<KnowledgeBase />} />
              <Route path="knowledge/:id" element={<KnowledgeDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;