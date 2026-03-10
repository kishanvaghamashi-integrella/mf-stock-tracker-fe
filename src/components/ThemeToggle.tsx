import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ToggleButton } from "./ThemeToggle.styled";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </ToggleButton>
  );
};

export default ThemeToggle;
