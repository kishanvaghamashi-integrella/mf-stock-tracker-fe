import { Navigate, Outlet } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const PublicRoute = () => {
  const { state } = useGlobalContext();
  if (state.user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PublicRoute;
