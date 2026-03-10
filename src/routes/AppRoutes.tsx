import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { api } from "../utils/api";
import type { User } from "../types";
import AppLayout from "../components/AppLayout";
import Dashboard from "../pages/Dashboard";
import Portfolio from "../pages/Portfolio";
import Transactions from "../pages/Transactions";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
  const { setState } = useGlobalContext();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await api.get<{ message: string; user: User }>(
          "/users/verify",
        );
        setState({ user: response.user });
      } catch (err: unknown) {
        localStorage.removeItem("token");
        setState({ user: null });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyUser();
  }, [setState]);

  if (isVerifying) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div style={{ color: "var(--text-muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
