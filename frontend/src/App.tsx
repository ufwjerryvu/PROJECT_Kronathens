import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { AuthProvider, useAuth } from './services/authentication/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
