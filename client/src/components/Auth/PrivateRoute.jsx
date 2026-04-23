import { Navigate, useLocation } from "react-router-dom";
import { useMyContext } from "./useMyContext";

const PrivateRoute = ({ element, allowedRoles }) => {
  const location = useLocation();
  const { authState } = useMyContext();

  if (!authState.isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const assignedRoles = authState.roles.length
    ? authState.roles.map((role) => role.name ?? role)
    : authState.role
      ? [authState.role]
      : [];

  if (allowedRoles && !allowedRoles.some((role) => assignedRoles.includes(role))) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default PrivateRoute;
