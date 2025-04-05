import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
