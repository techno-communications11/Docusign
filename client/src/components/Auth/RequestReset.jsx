import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { motion as Motion } from "framer-motion";

export const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/request-reset", { email });

      setMessage("Reset link sent successfully");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Something went wrong");
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
        Reset Password
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
            className="img-fluid w-75"
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
              {message && (
                <Motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="alert alert-success rounded-3"
                >
                  {message}
                </Motion.div>
              )}
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

              <form onSubmit={handleRequest}>
                <h4 className="mb-2 text-center fw-bold" style={{ color: "#E10174" }}>
                  Forgot your password?
                </h4>
                <p className="text-muted text-center mb-4" style={{ fontSize: "14px" }}>
                  Enter your email and we'll send you a reset link.
                </p>

                <div className="mb-3 position-relative">
                  <input
                    type="email"
                    id="emailInput"
                    className="form-control shadow-none rounded-pill text-center"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn text-white w-100 mt-3 rounded-pill"
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "#E10174",
                    borderColor: "#E10174",
                    padding: "12px",
                    boxShadow: "0 10px 20px rgba(225, 1, 116, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Motion.button>

                <div className="text-center mt-3">
                  <Link to="/" style={{ color: "#E10174", fontWeight: "600" }}>
                    Back to login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </Motion.div>
      </div>
    </Motion.div>
  );
};
