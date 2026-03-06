import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AuthContainer,
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthFormGroup,
  AuthLabel,
  AuthInput,
  AuthButton,
} from "./Auth.styled";
import { api } from "../utils/api";
import type { LoginRequest, LoginResponse } from "../types";
import { useGlobalContext } from "../context/GlobalContext";
import { showToast } from "../utils/toast";

const Login = () => {
  const { setState } = useGlobalContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post<LoginResponse>("/users/login", formData);
      setState({ user: response.user });
      showToast.success("Logged in successfully!");
      navigate("/"); // Redirect to dashboard
    } catch (err: any) {
      showToast.error(err.message || "Failed to login");
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle>Welcome Back</AuthTitle>
        <AuthSubtitle>Log in to track your portfolio</AuthSubtitle>

        <form onSubmit={handleSubmit}>
          <AuthFormGroup>
            <AuthLabel>Email</AuthLabel>
            <AuthInput
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthLabel>Password</AuthLabel>
            <AuthInput
              type="password"
              name="password"
              required
              placeholder="••••••••"
              onChange={handleChange}
            />
          </AuthFormGroup>
          <AuthButton type="submit">Sign In</AuthButton>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;
