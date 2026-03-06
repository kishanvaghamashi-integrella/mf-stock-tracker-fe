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
import type { RegisterRequest, RegisterResponse } from "../types";
import { showToast } from "../utils/toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password_hash: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post<RegisterResponse>("/users/", formData);
      showToast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err: any) {
      showToast.error(err.message || "Failed to register");
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle>Create an Account</AuthTitle>
        <AuthSubtitle>Start tracking your investments today</AuthSubtitle>

        <form onSubmit={handleSubmit}>
          <AuthFormGroup>
            <AuthLabel>Full Name</AuthLabel>
            <AuthInput
              type="text"
              name="name"
              required
              placeholder="John Doe"
              onChange={handleChange}
            />
          </AuthFormGroup>
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
              name="password_hash"
              required
              placeholder="••••••••"
              onChange={handleChange}
            />
          </AuthFormGroup>
          <AuthButton type="submit">Sign Up</AuthButton>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </AuthCard>
    </AuthContainer>
  );
};

export default Register;
