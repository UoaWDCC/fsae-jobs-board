import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();

  // 1. Get JWT Token from Storage
  const token = localStorage.getItem('accessToken'); // To be adjusted if we decide to handle tokens differently

  if (!token) {
    toast.error('You need to be logged in to access this page.');
    // Redirect users not logged-in to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    // 2. Decode the JWT Token
    const decodedToken: any = jwtDecode(token);

    // 3. Check if User's Role is Allowed
    if (!allowedRoles.includes(decodedToken.role)) {
      toast.error('You do not have permission to access this page.');
      // User does not have permission, redirect to unauthorised page
      return <Navigate to={"/profile/" + decodedToken.role} replace />;
    }

    // 4. If Authorised, Render Protected Content
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  } catch (error) {
    // Invalid token or decoding error
    toast.error('Invalid or expired token. Please log in again.');
    console.error('Error decoding JWT token:', error);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}

export default ProtectedRoute;
