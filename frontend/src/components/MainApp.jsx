// src/components/MainApp.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginPage from './LoginPage';
import ChatApp from './ChatApp';
import LoadingSpinner from './LoadingSpinner';

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <ChatApp /> : <LoginPage />;
};

export default MainApp;