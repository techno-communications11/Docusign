import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./components/Auth/Login.jsx";
import { Register } from "./components/Auth/Register.jsx";
import UpdatePassword from "./components/Auth/UpdatePassword.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";
import Home from "./components/Home.jsx";
import TexasDocument from "./components/TexasDocument.jsx";
import TechnoDocument from "./components/TechnoDocument.jsx";
import CustomNavbar from "./components/Auth/CustomNavbar.jsx";
import Activewireles from "./components/Activewireles.jsx";
import Techno_CA_Letterhead from "./components/Techno_CA_letterHead.jsx";

const AppContent = () => {
  const location = useLocation();
  const userData = localStorage.getItem("userData");
  const isAuthenticated = !!userData;

  const hideNavbarPaths = ["/"];
  const shouldShowNavbar = isAuthenticated && !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <CustomNavbar />}

      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/register" element={<PrivateRoute allowedRoles={["Admin"]} element={<Register />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/technodocu" element={<PrivateRoute element={<TechnoDocument />} />} />
        <Route path="/texasdocu" element={<PrivateRoute element={<TexasDocument />} />} />
        <Route path="/activewireless" element={<PrivateRoute element={<Activewireles />} />} />
        <Route path="/technoca" element={<PrivateRoute element={<Techno_CA_Letterhead />} />} />
        <Route path="/resetpassword" element={<PrivateRoute element={<UpdatePassword />} />} />

        <Route path="*" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
