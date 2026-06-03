import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import AuthLayout from './Components/AuthLayout';
import SignupForm from './Pages/Signup/SignupForm';
import TeacherOverview from './Pages/TeacherOverview/TeacherOverview';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/teacheroverview" element={<TeacherOverview />} />
      <Route element={<AuthLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;

