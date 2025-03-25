import React from "react";
import { Link } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../Styles/CustomNavbar.css";
import { useMyContext } from "./MyContext";

const CustomNavbar = () => {
  const { authState, logout } = useMyContext();
  // const navigate = useNavigate();

  const handleNavLinkClick = () => {
    const navbar = document.querySelector(".navbar-collapse");
    if (navbar) {
      navbar.classList.remove("show");
    }
  };

  // Show nothing while loading or if not authenticated
  if (authState.loading || !authState.isAuthenticated) {
    return null;
  }

  // Role-based home routes for Navbar.Brand
  const homeRoute =
    {
      Admin: "/home",
      User: "/home",
     
    }[authState.role] || "/"; // Fallback to /userdashboard if role not matched

  return (
    <Navbar expand="lg" className="jira-navbar">
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to={homeRoute}
          className="d-flex align-items-center"
        >
          <img src="logo.webp" height={30} alt="Logo" className="jira-logo" />
          <span className="jira-brand ms-2">Techno Communications LLC</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" className="jira-toggle" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto d-flex align-items-center">
            {authState.role === "Admin" && (
                <Nav.Link
                  as={Link}
                  to="/register"
                  className="fw-bolder jira-nav-link"
                  onClick={handleNavLinkClick}
                >
                  Register
                </Nav.Link>
              )}
                <Nav.Link
                  as={Link}
                  to="/resetpassword"
                  className="fw-bolder jira-nav-link"
                  onClick={handleNavLinkClick}
                >
                  Reset Password
                </Nav.Link>
              
            
            <Button
              variant="outline-danger"
              className="jira-logout-btn ms-2"
              onClick={logout}
            >
              <RiLogoutBoxRLine className="me-1" /> Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;