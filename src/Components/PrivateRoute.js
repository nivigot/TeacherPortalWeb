import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';

const PrivateRoute = ({ element }) => {
  return AuthService.isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
