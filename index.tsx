import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Try all possible mount point IDs
const rootElement = document.getElementById('wasilonline-react-app') ||
  document.getElementById('nova-react-app') ||
  document.getElementById('root');

if (!rootElement) {
  console.error('❌ React mount point not found. Looking for: #wasilonline-react-app or #nova-react-app');
  console.log('Available divs:', document.querySelectorAll('div[id*="react"]'));
} else {
  console.log('✅ Mounting React to:', rootElement.id);
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
