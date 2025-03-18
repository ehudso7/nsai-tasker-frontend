import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/styles/index.css';
import { initializeMonitoring } from './utils/monitoring';

// Initialize monitoring (Sentry)
initializeMonitoring();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report web vitals for performance monitoring
reportWebVitals(metric => {
  // Send metrics to analytics or monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to Google Analytics
    console.log(metric);
  }
});
