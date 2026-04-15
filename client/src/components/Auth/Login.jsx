import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useMyContext } from "./useMyContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { updateAuth } = useMyContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      const contentType = loginResponse.headers.get("content-type") || "";
      const loginData = contentType.includes("application/json")
        ? await loginResponse.json()
        : { error: await loginResponse.text() };

      if (!loginResponse.ok) {
        throw new Error(loginData.error || "Login failed");
      }

      const { role, id } = loginData.user;
      updateAuth(true, role, id);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center position-relative"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f3e7e9 100%)",
        overflow: "hidden",
      }}
    >
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

      <Motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
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
      </Motion.h1>

      <div className="row w-100 m-0">
        <Motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-md-6 d-flex justify-content-center align-items-center"
        >
          <Motion.img
            transition={{ type: "spring", stiffness: 300 }}
            src="logoT.webp"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "70%" }}
          />
        </Motion.div>

        <Motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-md-6 d-flex justify-content-center align-items-center p-2 p-lg-5"
        >
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
                <Motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="alert alert-danger rounded-3"
                  style={{ borderColor: "#E10174" }}
                >
                  {error}
                </Motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <h4 className="mb-4 text-center fw-bold" style={{ color: "#E10174" }}>
                  Login to Your Account
                </h4>
                <div className="mb-3 position-relative">
                  <input
                    type="email"
                    className="form-control shadow-none rounded-pill text-center"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                    style={{
                      borderColor: "#E10174",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }}
                  />
                  <FaEnvelope
                    className="position-absolute start-0 top-50 translate-middle-y ms-3"
                    size={18}
                    color="#E10174"
                  />
                </div>
                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control shadow-none rounded-pill text-center"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    style={{
                      borderColor: "#E10174",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }}
                  />
                  <FaLock
                    className="position-absolute start-0 top-50 translate-middle-y ms-3"
                    size={18}
                    color="#E10174"
                  />
                  <Motion.span
                    whileHover={{ scale: 1.2 }}
                    className="position-absolute end-0 me-3 top-50 translate-middle-y"
                    style={{ cursor: "pointer", color: "#E10174" }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Motion.span>
                </div>

                <Link to="/forgot-password">Forgot password?</Link>
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </Motion.button>
              </form>
            </div>
          </div>
        </Motion.div>
      </div>
    </Motion.div>
  );
};

export { Login };
