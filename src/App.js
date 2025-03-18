import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// Import layouts and common components normally
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy load page components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ReviewQueuePage = lazy(() => import('./pages/ReviewQueuePage'));
const TaskReviewPage = lazy(() => import('./pages/TaskReviewPage'));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage'));

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute requiredRoles={['reviewer', 'admin']}>
                  <MainLayout>
                    <ReviewQueuePage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reviews/tasks/:taskId" 
              element={
                <ProtectedRoute requiredRoles={['reviewer', 'admin']}>
                  <MainLayout>
                    <TaskReviewPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'reviewer']}>
                  <MainLayout>
                    <AnalyticsDashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect to dashboard if logged in, otherwise to login */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            {/* 404 - Catch all route */}
            <Route 
              path="*" 
              element={
                <MainLayout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                    <p>The page you are looking for does not exist.</p>
                  </div>
                </MainLayout>
              } 
            />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
