import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { GlobalProvider, useGlobalContext } from "./context/GlobalContext";

// Simple wrapper to protect private routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useGlobalContext();
  if (!state.user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
