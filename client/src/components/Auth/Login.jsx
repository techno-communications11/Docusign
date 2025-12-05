import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const loginResponse = await fetch(`/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      let loginData = {};
      try {
        loginData = await loginResponse.json();
      } catch (err) {
        return err;
      }

      if (!loginResponse.ok) {
        throw new Error(loginData.error || "Login failed");
      }

      localStorage.setItem("userData", JSON.stringify(loginData.user)); // FIXED

      const role = loginData.user.role;
      if (role === "Admin" || role === "User") {
        navigate("/home", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center position-relative"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f3e7e9 100%)",
        overflow: "hidden",
      }}
    >
      {/* Decorative shapes */}
      <div
        className="position-absolute"
        style={{
          top: "-10%",
          left: "-10%",
          width: "300px",
          height: "300px",
          background: "rgba(225, 1, 116, 0.1)",
          borderRadius: "50%",
          transform: "rotate(45deg)",
        }}
      />
      <div
        className="position-absolute"
        style={{
          bottom: "-10%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "rgba(225, 1, 116, 0.05)",
          borderRadius: "50%",
          transform: "rotate(-45deg)",
        }}
      />

      {/* Heading */}
      <h1
        className="text-center mb-5"
        style={{
          color: "#E10174",
          fontWeight: "bold",
          fontSize: "4rem",
          letterSpacing: "2px",
          textShadow: "2px 2px 4px rgba(225, 1, 116, 0.1)",
        }}
      >
        Welcome Back!
      </h1>

      <div className="row w-100 m-0">
        {/* Logo side */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src="logoT.webp"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "70%" }}
          />
        </div>

        {/* Login card */}
        <div className="col-md-6 d-flex justify-content-center align-items-center p-2 p-lg-5">
          <div
            className="card shadow-lg col-12 col-md-8 col-lg-10 border-0 rounded-4"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(225, 1, 116, 0.1)",
            }}
          >
            <div className="card-body p-5">
              {error && (
                <div className="alert alert-danger rounded-3">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <h4
                  className="mb-4 text-center fw-bold"
                  style={{ color: "#E10174" }}
                >
                  Login to Your Account
                </h4>

                {/* Email */}
                <div className="mb-3 position-relative">
                  <input
                    type="email"
                    className="form-control shadow-none rounded-pill text-center"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                    autoComplete="email"
                    style={{
                      borderColor: "#E10174",
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                    }}
                  />
                  <FaEnvelope
                    className="position-absolute start-0 top-50 translate-middle-y ms-3"
                    size={18}
                    color="#E10174"
                  />
                </div>

                {/* Password */}
                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control shadow-none rounded-pill text-center"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                    style={{
                      borderColor: "#E10174",
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                    }}
                  />
                  <FaLock
                    className="position-absolute start-0 top-50 translate-middle-y ms-3"
                    size={18}
                    color="#E10174"
                  />
                  <span
                    className="position-absolute end-0 me-3 top-50 translate-middle-y"
                    style={{ cursor: "pointer", color: "#E10174" }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="btn text-white w-100 mt-3 rounded-pill"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "#E10174",
                    borderColor: "#E10174",
                    padding: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 10px 20px rgba(225, 1, 116, 0.3)",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.boxShadow =
                      "0 12px 24px rgba(225, 1, 116, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.boxShadow =
                      "0 10px 20px rgba(225, 1, 116, 0.3)";
                  }}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login };
