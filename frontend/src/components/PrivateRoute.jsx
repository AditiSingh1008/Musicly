// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, isAuth }) => {
  return isAuth ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
