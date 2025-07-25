import React from 'react';

import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './services/authentication/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
