import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GlobalProvider } from "./context/GlobalContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
