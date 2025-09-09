import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UserRoute from "./routes/UserRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/*" element={<UserRoute />} />
        {/* Admin Routes */}
        {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
