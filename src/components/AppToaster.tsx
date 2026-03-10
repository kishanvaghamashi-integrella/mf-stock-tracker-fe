import toast, { Toaster, ToastBar } from "react-hot-toast";
import { X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const AppToaster = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const toastStyle: React.CSSProperties = {
    background: isDark ? "#28251f" : "#ffffff",
    color: isDark ? "#f0ece4" : "#334155",
    border: `1px solid ${isDark ? "#3d3a34" : "#e2e8f0"}`,
    borderRadius: "8px",
    padding: "16px",
    fontWeight: 500,
    boxShadow: isDark
      ? "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)"
      : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  };

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{ style: toastStyle }}
    >
      {(t) => (
        <ToastBar toast={t} style={toastStyle}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== "loading" && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Dismiss notification"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 0 0 8px",
                    color: isDark ? "#9c9589" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default AppToaster;
