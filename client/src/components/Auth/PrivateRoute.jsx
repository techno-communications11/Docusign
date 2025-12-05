import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles }) => {
  const location = useLocation();
  const userData = localStorage.getItem("userData");
  const isAuthenticated = !!userData;

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const userRole = JSON.parse(userData)?.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default PrivateRoute;
