import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./components/Auth/Login.jsx";
import { Register } from "./components/Auth/Register.jsx";
import UpdatePassword from "./components/Auth/UpdatePassword.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";
import Home from "./components/Home.jsx";
import TexasDocument from "./components/TexasDocument.jsx";
import TechnoDocument from "./components/TechnoDocument.jsx";
import { useMyContext } from "./components/Auth/MyContext";
import CustomNavbar from "./components/Auth/CustomNavbar.jsx";

const AppContent = () => {
  const location = useLocation();
  const { authState } = useMyContext();

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  // Define default redirect routes based on role
  

  return (
    <>
      {authState.isAuthenticated && location.pathname !== "/" && <CustomNavbar />}
      <Routes>
        <Route
          path="/"
          element={
            
              <Login />
            
          }
        />
       
        {authState.isAuthenticated && authState.role === "Admin" && (
          <>
           <Route path="/home" element={<PrivateRoute element={<Home />} />} />
           <Route path="/technodocu" element={<PrivateRoute element={<TechnoDocument />} />} />
           <Route path="/texasdocu" element={<PrivateRoute element={<TexasDocument />} />} />
            
            <Route path="/register" element={<PrivateRoute element={<Register />} />} />
            <Route
              path="/resetpassword"
              element={<PrivateRoute element={<UpdatePassword />} />}
            />
          </>
        )}
      
       
      
        <Route path="*" element={<Navigate to="/" />} />
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