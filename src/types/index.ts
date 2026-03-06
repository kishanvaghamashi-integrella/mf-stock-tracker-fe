export interface User {
  id?: number | string;
  name?: string;
  email?: string;
  token?: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  name?: string;
  email?: string;
  password?: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}
