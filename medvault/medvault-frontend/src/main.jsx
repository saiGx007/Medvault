import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // Ensure this path is correct

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* THIS MUST WRAP EVERYTHING */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);