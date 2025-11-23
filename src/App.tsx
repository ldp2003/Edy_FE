import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UserRoute from "./routes/UserRoute";
import AdminRoute from "./routes/AdminRoute";
import BannedUserPage from "./pages/Error/BannedUserPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Banned User Page - accessible without authentication */}
        <Route path="/banned" element={<BannedUserPage />} />
        {/* User Routes */}
        <Route path="/*" element={<UserRoute />} />
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
