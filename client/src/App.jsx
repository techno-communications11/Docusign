import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Login } from "./components/Auth/Login.jsx";
import { Register } from "./components/Auth/Register.jsx";
import UpdatePassword from "./components/Auth/UpdatePassword.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";
import Home from "./components/Home.jsx";
import TexasDocument from "./components/TexasDocument.jsx";
import TechnoDocument from "./components/TechnoDocument.jsx";
import { useMyContext } from "./components/Auth/useMyContext";
import CustomNavbar from "./components/Auth/CustomNavbar.jsx";
import Activewireles from "./components/Activewireles.jsx";
import Techno_CA_Letterhead from "./components/Techno_CA_letterHead.jsx";
import { RequestReset } from "./components/Auth/RequestReset.jsx";

const AppContent = () => {
  const location = useLocation();
  const { authState } = useMyContext();

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated || location.pathname === "/") {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<RequestReset />} />
        <Route path="/reset-password/:token" element={<UpdatePassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="authenticated-layout">
      <CustomNavbar />
      <main className="authenticated-content">
        <Routes>
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/technodocu" element={<PrivateRoute element={<TechnoDocument />} />} />
          <Route path="/texasdocu" element={<PrivateRoute element={<TexasDocument />} />} />
          <Route path="/activewireless" element={<PrivateRoute element={<Activewireles />} />} />
          <Route path="/technoca" element={<PrivateRoute element={<Techno_CA_Letterhead />} />} />
          <Route
            path="/register"
            element={<PrivateRoute allowedRoles={["writeup_admin"]} element={<Register />} />}
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
