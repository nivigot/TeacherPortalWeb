import { Outlet, Navigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';

const AuthLayout = () => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
     
      <Outlet />
    </div>
  );
};

export default AuthLayout;
