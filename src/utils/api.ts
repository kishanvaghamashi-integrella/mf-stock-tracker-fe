const BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:8080/api";

export const api = {
  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = "An error occurred";

      if (data.error) {
        if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (data.error.errors && Array.isArray(data.error.errors)) {
          // Format validation errors such as: { field: "PasswordHash", message: "..." }
          errorMessage = data.error.errors
            .map(
              (err: any) =>
                `${err.field} - ${err.message}` || JSON.stringify(err),
            )
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
  },
};
