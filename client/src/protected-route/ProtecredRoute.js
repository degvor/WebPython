import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, adminOnly, children }) => {
  // if (adminOnly && !isAdmin) {
  //   return <Navigate to="/access-denied" />;
  // }
  //
  // if (!adminOnly && isAdmin) {
  //   return <Navigate to="/access-denied" />;
  // }
  //
  // if (isAdmin === undefined) {
  //   return <Navigate to="/login" />;
  // }

  return children;
};

export default ProtectedRoute;