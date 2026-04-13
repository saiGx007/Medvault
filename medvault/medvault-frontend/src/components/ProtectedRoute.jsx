 import React from 'react';
 import { Navigate } from 'react-router-dom';

 const ProtectedRoute = ({ children, allowedRole }) => {
   const token = localStorage.getItem("token");
   const userRole = localStorage.getItem("role");

   // 1. If no token, go back to login
   if (!token) {
     return <Navigate to="/login" replace />;
   }

   // 2. If role doesn't match, go back to login (or an unauthorized page)
   if (allowedRole && userRole !== allowedRole) {
     console.error(`Access denied. Expected: ${allowedRole}, Found: ${userRole}`);
     return <Navigate to="/login" replace />;
   }

   return children;
 };

 export default ProtectedRoute;