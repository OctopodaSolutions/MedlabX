import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


/**
 * A higher-order component that protects routes by checking if the user is authenticated.
 * 
 * This component checks the `isLoggedIn` state from the Redux store to determine 
 * if the user is authenticated. If the user is not authenticated, they are redirected 
 * to the home page ("/"). If the user is authenticated, the `children` components are rendered.
 * 
 * @param {Object} props - The props for this component.
 * @param {React.ReactNode} props.children - The child components to render if the user is authenticated.
 * @returns {React.ReactNode} - Returns the `children` if authenticated, otherwise a `Navigate` component to redirect.
 */
export const ProtectedRoute = ({ children }) => {
  // Get authentication status from the Redux store
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);

  if (!isAuthenticated) {
      // Redirect to the home page if not authenticated
      return <Navigate to="/" />;
  }

  // Render the children components if authenticated
  return children;
};