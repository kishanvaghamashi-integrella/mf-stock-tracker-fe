import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GlobalProvider } from "./context/GlobalContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

const AppContent = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: isDark ? "#28251f" : "#ffffff",
            color: isDark ? "#f0ece4" : "#334155",
            border: `1px solid ${isDark ? "#3d3a34" : "#e2e8f0"}`,
            borderRadius: "8px",
            padding: "16px",
            fontWeight: 500,
            boxShadow: isDark
              ? "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)"
              : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          },
        }}
      />
      <AppRoutes />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <GlobalProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </GlobalProvider>
    </ThemeProvider>
  );
}

export default App;
