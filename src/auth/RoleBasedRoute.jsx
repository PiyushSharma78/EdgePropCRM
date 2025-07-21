import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

export default function RoleBasedRoute({ allowedRoles, children }) {
  // const { user } = useAuth();
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
}
