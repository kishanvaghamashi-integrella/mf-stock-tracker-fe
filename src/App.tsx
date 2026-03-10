import { BrowserRouter } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import AppToaster from "./components/AppToaster";

function App() {
  return (
    <ThemeProvider>
      <GlobalProvider>
        <BrowserRouter>
          <AppToaster />
          <AppRoutes />
        </BrowserRouter>
      </GlobalProvider>
    </ThemeProvider>
  );
}

export default App;
