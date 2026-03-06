import { Navigate, Outlet } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const ProtectedRoute = () => {
  const { state } = useGlobalContext();
  if (!state.user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
