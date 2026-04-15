import { Navigate, useLocation } from "react-router-dom";
import { useMyContext } from "./useMyContext";

const PrivateRoute = ({ element, allowedRoles }) => {
  const location = useLocation();
  const { authState } = useMyContext();

  if (!authState.isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(authState.role)) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default PrivateRoute;
