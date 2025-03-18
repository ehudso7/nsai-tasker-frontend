import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initializeMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      
      // We recommend adjusting this value in production
      tracesSampleRate: 0.5,
      
      // Set environment
      environment: process.env.NODE_ENV,
      
      // Capture errors based on environment
      enabled: process.env.NODE_ENV === 'production',
      
      // Add release information
      release: process.env.REACT_APP_VERSION || '1.0.0',
    });
  }
};

// Custom error logging
export const logError = (error, context = {}) => {
  console.error('Application Error:', error);
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: {
        component: context.component || 'Unknown',
        action: context.action || 'Unknown'
      },
      extra: context
    });
  }
};

// Performance monitoring
export const startPerformanceTransaction = (name, operation) => {
  if (process.env.NODE_ENV === 'production') {
    return Sentry.startTransaction({
      name,
      op: operation
    });
  }
  return null;
};

export const finishPerformanceTransaction = (transaction) => {
  if (transaction && process.env.NODE_ENV === 'production') {
    transaction.finish();
  }
};
