const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const UNPROTECTED_ROUTES = ["/users/login", "/users/"];

interface ValidationError {
  field: string;
  message: string;
}

const getHeaders = (endpoint: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const isUnprotected = UNPROTECTED_ROUTES.includes(endpoint);
  if (!isUnprotected) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async <T>(
  response: Response,
  endpoint: string,
): Promise<T> => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Globally handle completely unauthorized requests (except for auth routes like login)
    if (response.status === 401 && !UNPROTECTED_ROUTES.includes(endpoint)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    let errorMessage = "An error occurred";
    if (data.error) {
      if (typeof data.error === "string") {
        errorMessage = data.error;
      } else if (data.error.errors && Array.isArray(data.error.errors)) {
        errorMessage = data.error.errors
          .map((err: ValidationError) => `${err.field} - ${err.message}`)
          .join(" | ");
      } else {
        try {
          errorMessage = JSON.stringify(data.error);
        } catch {
          errorMessage = "Unknown error object";
        }
      }
    } else if (data.message) {
      errorMessage = data.message;
    }
    throw new Error(errorMessage);
  }
  return data as T;
};

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(endpoint),
    });
    return handleResponse<T>(response, endpoint);
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(endpoint),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response, endpoint);
  },
};
