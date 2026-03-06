import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  AuthContainer,
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthFormGroup,
  AuthLabel,
  AuthInput,
  AuthButton,
  PasswordInputWrapper,
  PasswordToggleButton,
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post<LoginResponse>("/users/login", formData);
      const token = response.user?.token || "";
      if (token) {
        localStorage.setItem("token", token);
      }
      setState({ user: response.user });
      showToast.success(response.message || "Logged in successfully!");
      navigate("/"); // Redirect to dashboard
    } catch (err: any) {
      showToast.error(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
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
            <PasswordInputWrapper>
              <AuthInput
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
              />
              <PasswordToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggleButton>
            </PasswordInputWrapper>
          </AuthFormGroup>
          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </AuthButton>
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
