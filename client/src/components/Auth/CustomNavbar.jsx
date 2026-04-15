import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaFileSignature, FaHome, FaTimes, FaUserPlus } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import "../Styles/CustomNavbar.css";
import { useMyContext } from "./useMyContext";

const CustomNavbar = () => {
  const { authState, logout } = useMyContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  // Show nothing while loading or if not authenticated
  if (authState.loading || !authState.isAuthenticated) {
    return null;
  }

  const homeRoute =
    {
      Admin: "/home",
      User: "/home",
     
    }[authState.role] || "/";

  const navItems = [
    { label: "Dashboard", path: homeRoute, icon: <FaHome /> },
    { label: "Texas Mobile PCS", path: "/texasdocu", icon: <FaFileSignature /> },
    { label: "Techno Communications", path: "/technodocu", icon: <FaFileSignature /> },
    { label: "Active Wireless", path: "/activewireless", icon: <FaFileSignature /> },
    { label: "Techno CA", path: "/technoca", icon: <FaFileSignature /> },
  ];

  return (
    <>
      <button
        type="button"
        className="side-nav-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
      >
        <FaBars />
      </button>

      {isOpen && (
        <button
          type="button"
          className="side-nav-backdrop"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside className={`side-nav ${isOpen ? "side-nav-open" : ""}`}>
        <div className="side-nav-header">
          <NavLink to={homeRoute} className="side-nav-brand" onClick={handleNavLinkClick}>
            <img src="/logo.webp" alt="Logo" className="side-nav-logo" />
            <span>
              <strong>Techno</strong>
              <small>Communications LLC</small>
            </span>
          </NavLink>

          <button
            type="button"
            className="side-nav-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <FaTimes />
          </button>
        </div>

        <div className="side-nav-role">
          <span>{authState.role || "User"}</span>
          <small>Signed in workspace</small>
        </div>

        <nav className="side-nav-links" aria-label="Main navigation">
          {navItems.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `side-nav-link ${isActive ? "side-nav-link-active" : ""}`
              }
              onClick={handleNavLinkClick}
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}

          {authState.role === "Admin" && (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `side-nav-link ${isActive ? "side-nav-link-active" : ""}`
              }
              onClick={handleNavLinkClick}
            >
              <FaUserPlus />
              <span>Register User</span>
            </NavLink>
          )}
        </nav>

        <button type="button" className="side-nav-logout" onClick={logout}>
          <RiLogoutBoxRLine />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default CustomNavbar;
